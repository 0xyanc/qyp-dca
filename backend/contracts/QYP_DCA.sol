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
        uint256[] orderIds;
    }

    IMakerOrderManager public immutable makerOrderManager;
    int24 public constant RESOLUTION = 5;

    address public gridAddress;
    IGrid public grid;
    address public immutable token0;
    address public immutable token1;

    /// @dev User storage, maps an DCA positions to a User.
    mapping(address => Dca[]) public usersPositions;

    event DcaSubmitted(
        address indexed user,
        uint256 totalAmount,
        uint128 amountPerOrder,
        uint256 frequency,
        uint256 numberOfOrders
    );
    event FundsWithdrawn(address indexed user, uint256 token0, uint256 token1);

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

    function submitDcaPosition(
        uint256 _totalAmount,
        uint128 _amountPerOrder,
        uint256 _frequency,
        uint256 _numberOfOrders,
        address tokenIn,
        int24 price
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

        // (, int24 boundary, , ) = grid.slot0();
        // // for this example, we will place a maker order at the current lower boundary of the grid
        // int24 boundaryLower = BoundaryMath.getBoundaryLowerAtBoundary(
        //     boundary,
        //     RESOLUTION
        // );

        // build the parameters before placing the order
        IMakerOrderManager.PlaceOrderParameters
            memory parameters = IMakerOrderManager.PlaceOrderParameters({
                deadline: block.timestamp,
                recipient: msg.sender,
                tokenA: token0,
                tokenB: token1,
                resolution: RESOLUTION,
                zero: grid.token0() == tokenIn,
                boundaryLower: price,
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
            _numberOfOrders
        );
    }

    function withdrawFunds() external {}

    function showPositions() external {}
}
