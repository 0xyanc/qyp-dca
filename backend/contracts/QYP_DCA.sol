// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IMakerOrderManager.sol";
import "@gridexprotocol/core/contracts/interfaces/IGrid.sol";
import "@gridexprotocol/core/contracts/interfaces/IGridEvents.sol";
import "@gridexprotocol/core/contracts/libraries/GridAddress.sol";
import "@gridexprotocol/core/contracts/libraries/BoundaryMath.sol";

error QYP_DCA__InvalidToken();
error QYP_DCA__InvalidAmount();
error QYP_DCA__InvalidFrequency();
error QYP_DCA__InvalidNumberOfOrders();
error QYP_DCA__InvalidDcaIndex();
error QYP_DCA__NoDcaPosition();
error QYP_DCA__UserDoesNotOwnDcaPosition();
error QYP_DCA__InvalidPercentage();
error QYP_DCA__OrdersNotAllSubmitted();

/**
 * @title Smart contract managing DCA positions from Users. Calling GridEx contract to submit orders.
 * @author 0xyanc
 */
contract QYP_DCA {
    struct Dca {
        uint256 totalAmount;
        uint128 amountPerOrder;
        uint256 frequency;
        uint256 numberOfOrders;
        uint256 creationDate;
        uint256 timestampLastSubmittedOrder;
        address tokenIn;
        address owner;
        uint176 index;
        uint256[] orderIds;
    }

    struct Order {
        uint256 orderId;
        int24 price;
        uint128 makerAmountTotal;
        uint128 makerAmountRemaining;
        address owner;
    }

    /// @dev the makerOrderManager to submit the orders to
    IMakerOrderManager public immutable makerOrderManager;

    /// @dev use 0.05% resolution where most liquidity should be
    int24 public constant RESOLUTION = 5;

    /// @dev address of the grid associated with this token pair
    address public gridAddress;
    /// @dev grid associated with this token pair
    IGrid public grid;
    /// @dev token0 of the grid pair - should be WETH
    address public immutable token0;
    /// @dev token1 of the grid pair - should be USDC
    address public immutable token1;

    /// @dev Dca positions storage
    Dca[] public allDcaPositions;

    /**
     * Fired in submitDcaPosition()
     * @param user user that submitted the DCA position
     * @param amountPerOrder amount to invest for each order
     * @param frequency frequency to invest the amount
     * @param numberOfOrders number of orders to be submitted in total
     */
    event DcaSubmitted(
        address indexed user,
        uint128 amountPerOrder,
        uint256 frequency,
        uint256 numberOfOrders,
        uint256 dcaIndex
    );
    /**
     * Fired in withdrawFunds()
     * @param user user that withdrew their funds
     * @param token0 address of token0 withdrawn
     * @param token1 address of token1 withdrawn
     * @param amount0 amount of token0 withdrawn
     * @param amount1 amount of token1 withdrawn
     */
    event FundsWithdrawn(
        address indexed user,
        address token0,
        address token1,
        uint256 amount0,
        uint256 amount1
    );

    /**
     * @notice Fired in submitDcaPosition() and submitScheduledOrder()
     * @param user recipient of the order
     * @param orderId id of the order
     * @param amount amount of token for the order
     */
    event OrderSubmitted(address indexed user, uint256 orderId, uint256 amount);

    constructor(
        IMakerOrderManager _makerOrderManager,
        IGrid _grid,
        address _token0,
        address _token1
    ) {
        makerOrderManager = _makerOrderManager;
        grid = _grid;
        token0 = _token0;
        token1 = _token1;

        // allow the maker order manager to spend token0
        SafeERC20.safeIncreaseAllowance(
            IERC20(token0),
            address(makerOrderManager),
            2 ** 256 - 1
        );

        // allow the maker order manager to spend token1
        SafeERC20.safeIncreaseAllowance(
            IERC20(token1),
            address(makerOrderManager),
            2 ** 256 - 1
        );
    }

    /**
     * @notice Submit a DCA position, specifying the desired amount, frequency and number of orders.
     * @param _amountPerOrder amount to be invested by the user for each period
     * @param _frequency frequency to invest the user's fund
     * @param _numberOfOrders total number of orders
     * @param _tokenIn token to DCA in
     */
    function submitDcaPosition(
        uint128 _amountPerOrder,
        uint256 _frequency,
        uint256 _numberOfOrders,
        address _tokenIn
    ) external {
        if (_tokenIn != token0 && _tokenIn != token1) {
            revert QYP_DCA__InvalidToken();
        }
        if (_amountPerOrder == 0) {
            revert QYP_DCA__InvalidAmount();
        }
        if (_frequency == 0) {
            revert QYP_DCA__InvalidFrequency();
        }
        if (_numberOfOrders == 0) {
            revert QYP_DCA__InvalidNumberOfOrders();
        }
        // msg.sender MUST approve the contract to spend the input token
        // transfer the specified amount of tokenIn to this contract
        SafeERC20.safeTransferFrom(
            IERC20(_tokenIn),
            msg.sender,
            address(this),
            _amountPerOrder * _numberOfOrders
        );

        (, int24 boundary, , ) = grid.slot0();
        // we will place a maker order at the current lower boundary of the grid which corresponds to the best to the current price
        int24 boundaryLower = BoundaryMath.getBoundaryLowerAtBoundary(
            boundary,
            RESOLUTION
        );

        // build the parameters before placing the order
        IMakerOrderManager.PlaceOrderParameters
            memory parameters = IMakerOrderManager.PlaceOrderParameters({
                deadline: block.timestamp,
                recipient: address(this),
                tokenA: token0,
                tokenB: token1,
                resolution: RESOLUTION,
                zero: grid.token0() == _tokenIn,
                boundaryLower: boundaryLower,
                amount: _amountPerOrder
            });

        // call the Grid to place the order
        uint256 orderId = makerOrderManager.placeMakerOrder(parameters);

        // build the DCA position
        Dca memory position;
        position.amountPerOrder = _amountPerOrder;
        position.frequency = _frequency;
        position.numberOfOrders = _numberOfOrders;
        position.owner = msg.sender;
        position.creationDate = block.timestamp;
        position.timestampLastSubmittedOrder = block.timestamp;
        position.tokenIn = _tokenIn;
        position.index = uint176(allDcaPositions.length);

        allDcaPositions.push(position);
        allDcaPositions[allDcaPositions.length - 1].orderIds.push(orderId);

        // emit DcaSubmitted
        emit DcaSubmitted(
            msg.sender,
            _amountPerOrder,
            _frequency,
            _numberOfOrders,
            allDcaPositions.length - 1
        );
        // emit OrderSubmitted event
        emit OrderSubmitted(msg.sender, orderId, _amountPerOrder);
    }

    /**
     * @notice Withdraw funds from the DCA contract and transfer token0 and token1 back to the user.
     *         All orders might not have been filled, it will settle (i.e. cancel) all outstanding orders.
     * @param _dcaIndex The DCA position to settle
     * @param _unwrapWeth true to unwrap WETH
     */
    function withdrawFunds(uint256 _dcaIndex, bool _unwrapWeth) external {
        if (allDcaPositions.length == 0) {
            revert QYP_DCA__NoDcaPosition();
        }
        if (_dcaIndex >= allDcaPositions.length) {
            revert QYP_DCA__InvalidDcaIndex();
        }
        if (msg.sender != allDcaPositions[_dcaIndex].owner) {
            revert QYP_DCA__UserDoesNotOwnDcaPosition();
        }
        if (
            allDcaPositions[_dcaIndex].orderIds.length <
            allDcaPositions[_dcaIndex].numberOfOrders
        ) {
            revert QYP_DCA__OrdersNotAllSubmitted();
        }
        // retrieve orderIds from this dca position
        uint256[] memory orderIds = allDcaPositions[_dcaIndex].orderIds;
        // settle and collect all orderIds from this dca position, whether they have been filled or not
        (uint128 amount0Total, uint128 amount1Total) = grid
            .settleMakerOrderAndCollectInBatch(
                address(this),
                orderIds,
                _unwrapWeth
            );
        //tranfer WETh back to user
        SafeERC20.safeTransfer(IERC20(token0), msg.sender, amount0Total);
        //transfer USDC back to user
        SafeERC20.safeTransfer(IERC20(token1), msg.sender, amount1Total);
        // remove the position
        delete allDcaPositions[_dcaIndex];
        // emit FundsWithdrawn event
        emit FundsWithdrawn(
            msg.sender,
            token0,
            token1,
            amount0Total,
            amount1Total
        );
    }

    /**
     * @notice Show all orders info from a specific DCA positions of a user
     * @param _user address of the user to show positions from
     * @param _dcaIndex index of the DCA position to get orders from
     */
    function showDcaInfo(
        address _user,
        uint256 _dcaIndex
    ) external view returns (Order[] memory) {
        Order[] memory emptyOrders = new Order[](0);
        // user has no DCA position
        if (allDcaPositions.length == 0) return emptyOrders;
        // dca index does not exist
        if (_dcaIndex >= allDcaPositions.length) return emptyOrders;
        // user is different than dca position owner
        if (_user != allDcaPositions[_dcaIndex].owner) return emptyOrders;
        // loop through all the orders of this DCA position
        uint256[] storage orderIds = allDcaPositions[_dcaIndex].orderIds;
        Order[] memory orders = new Order[](orderIds.length);
        for (uint256 i; i < orderIds.length; ++i) {
            uint256 orderId = orderIds[i];
            // retrieve bundleId that the order belongs to
            (uint64 bundleId, address owner, ) = grid.orders(orderId);
            // retrieve the price, makerAmountTotal, makerAmountRemaining from the bundle
            (
                int24 price,
                ,
                uint128 makerAmountTotal,
                uint128 makerAmountRemaining,
                ,

            ) = grid.bundles(bundleId);
            // build the Order object
            Order memory order = Order(
                orderId,
                price,
                makerAmountTotal,
                makerAmountRemaining,
                owner
            );
            // add to the array to be returned
            orders[i] = order;
        }
        return orders;
    }

    /**
     * @notice Called by Gelato daily to submit orders that are meeting the frequency criteria
     */
    function dailyOrderSubmission() external {
        for (uint256 index; index < allDcaPositions.length; ++index) {
            Dca memory dca = allDcaPositions[index];
            // if dca position has waited long enough to submit next order
            if (
                block.timestamp - dca.timestampLastSubmittedOrder >=
                dca.frequency
            ) {
                submitdOrder(dca.owner, dca.amountPerOrder, dca.tokenIn, index);
            }
        }
    }

    /**
     * @notice helper function to return all DCA positions
     */
    function getAllDcaPositions() external view returns (Dca[] memory) {
        return allDcaPositions;
    }

    /**
     * @notice Submit a maker order for the recipient
     * @param _recipient user that will receive the tokens
     * @param _amountPerOrder amount of tokenIn for the order
     * @param _tokenIn token to DCA in
     * @param _dcaIndex DCA position where the scheduled order originated from
     */
    function submitdOrder(
        address _recipient,
        uint128 _amountPerOrder,
        address _tokenIn,
        uint256 _dcaIndex
    ) private {
        (, int24 boundary, , ) = grid.slot0();
        // we will place a maker order at the current lower boundary of the grid which corresponds to the best to the current price
        int24 boundaryLower = BoundaryMath.getBoundaryLowerAtBoundary(
            boundary,
            RESOLUTION
        );

        // build the parameters before placing the order
        IMakerOrderManager.PlaceOrderParameters
            memory parameters = IMakerOrderManager.PlaceOrderParameters({
                deadline: block.timestamp,
                recipient: address(this),
                tokenA: token0,
                tokenB: token1,
                resolution: RESOLUTION,
                zero: grid.token0() == _tokenIn,
                boundaryLower: boundaryLower,
                amount: _amountPerOrder
            });

        // call the Grid to place the order
        uint256 orderId = makerOrderManager.placeMakerOrder(parameters);

        // update last submitted order timestamp for this DCA
        allDcaPositions[_dcaIndex].timestampLastSubmittedOrder = block
            .timestamp;
        // add the orderId to the array of the user's specific DCA position
        allDcaPositions[_dcaIndex].orderIds.push(orderId);

        // emit OrderSubmitted event
        emit OrderSubmitted(_recipient, orderId, _amountPerOrder);
    }
}
