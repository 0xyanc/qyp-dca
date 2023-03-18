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
        address tokenIn;
        uint256[] orderIds;
    }

    struct Order {
        uint256 orderId;
        int24 price;
        uint128 makerAmountTotal;
        uint128 makerAmountRemaining;
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

    /// @dev User storage, maps an DCA positions to a User.
    mapping(address => Dca[]) public usersPositions;

    /**
     * Fired in submitDcaPosition()
     * @param user user that submitted the DCA position
     * @param totalAmount total amount invested by the user
     * @param amountPerOrder amount to invest for each order
     * @param frequency frequency to invest the amount
     * @param numberOfOrders number of orders to be submitted in total
     */
    event DcaSubmitted(
        address indexed user,
        uint256 totalAmount,
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

    constructor(
        IMakerOrderManager _makerOrderManager,
        address _token0,
        address _token1
    ) {
        makerOrderManager = _makerOrderManager;
        token0 = _token0;
        token1 = _token1;
        // compute grid address based on token pair
        gridAddress = GridAddress.computeAddress(
            makerOrderManager.gridFactory(),
            GridAddress.gridKey(token0, token1, RESOLUTION)
        );
        grid = IGrid(gridAddress);
    }

    /**
     * @notice Submit a DCA position, specifying the desired amount, frequency and number of orders.
     * @param _totalAmount total amount to be invested by the user
     * @param _amountPerOrder amount to be invested by the user for each period
     * @param _frequency frequency to invest the user's fund
     * @param _numberOfOrders total number of orders
     * @param tokenIn token to DCA in
     */
    function submitDcaPosition(
        uint256 _totalAmount,
        uint128 _amountPerOrder,
        uint256 _frequency,
        uint256 _numberOfOrders,
        address tokenIn
    ) external {
        if (tokenIn != token0 && tokenIn != token1) {
            revert QYP_DCA__InvalidToken();
        }
        if (_totalAmount == 0 || _amountPerOrder == 0) {
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
            IERC20(tokenIn),
            msg.sender,
            address(this),
            _totalAmount
        );

        // approve the maker order manager to spend tokenIn
        SafeERC20.safeApprove(
            IERC20(tokenIn),
            address(makerOrderManager),
            _totalAmount
        );

        (, int24 boundary, , ) = grid.slot0();
        // for this example, we will place a maker order at the current lower boundary of the grid
        int24 boundaryLower = BoundaryMath.getBoundaryLowerAtBoundary(
            boundary,
            RESOLUTION
        );

        // build the parameters before placing the order
        IMakerOrderManager.PlaceOrderParameters
            memory parameters = IMakerOrderManager.PlaceOrderParameters({
                deadline: block.timestamp,
                recipient: msg.sender,
                tokenA: token0,
                tokenB: token1,
                resolution: RESOLUTION,
                zero: grid.token0() == tokenIn,
                boundaryLower: boundaryLower,
                amount: _amountPerOrder
            });

        // call the Grid to place the order
        uint256 orderId = makerOrderManager.placeMakerOrder(parameters);

        // build the DCA position
        Dca memory position;
        position.totalAmount = _totalAmount;
        position.amountPerOrder = _amountPerOrder;
        position.frequency = _frequency;
        position.numberOfOrders = _numberOfOrders;
        usersPositions[msg.sender].push(position);
        uint256 length = usersPositions[msg.sender].length;
        usersPositions[msg.sender][length - 1].orderIds.push(orderId);

        emit DcaSubmitted(
            msg.sender,
            _totalAmount,
            _amountPerOrder,
            _frequency,
            _numberOfOrders,
            length - 1
        );
    }

    /**
     * @notice Withdraw funds from the DCA contract and transfer token0 and token1 back to the user.
     *         All orders might not have been filled, it will settle (i.e. cancel) all outstanding orders.
     * @param dcaIndex The DCA position to settle
     * @param unwrapWeth true to unwrap WETH
     */
    function withdrawFunds(uint256 dcaIndex, bool unwrapWeth) external {
        if (usersPositions[msg.sender].length == 0) {
            revert QYP_DCA__NoDcaPosition();
        }
        if (dcaIndex >= usersPositions[msg.sender].length) {
            revert QYP_DCA__InvalidDcaIndex();
        }
        uint256[] memory orderIds = usersPositions[msg.sender][dcaIndex]
            .orderIds;
        (uint128 amount0Total, uint128 amount1Total) = grid
            .settleMakerOrderAndCollectInBatch(
                msg.sender,
                orderIds,
                unwrapWeth
            );
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
     * @param user address of the user to show positions from
     * @param dcaIndex index of the DCA position to get orders from
     */
    function showDcaInfo(
        address user,
        uint256 dcaIndex
    ) external view returns (Order[] memory) {
        Order[] memory orders;
        // user has no DCA position
        if (usersPositions[user].length == 0) return orders;
        // dca index does not exist
        if (dcaIndex >= usersPositions[msg.sender].length) return orders;
        // loop through all the orderss of this DCA position
        uint256[] storage orderIds = usersPositions[msg.sender][dcaIndex]
            .orderIds;

        for (uint256 i = 0; i < orderIds.length; ++i) {
            uint256 orderId = orderIds[i];
            // retrieve bundleId that the order belongs to
            (uint64 bundleId, , ) = grid.orders(orderId);
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
                makerAmountRemaining
            );
            // add to the array to be returned
            orders[i] = order;
        }
        return orders;
    }

    // function that will be called to submit future orders
}
