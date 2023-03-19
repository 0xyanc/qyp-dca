export const ABI_QYP = [
  {
    inputs: [
      {
        internalType: "contract IMakerOrderManager",
        name: "_makerOrderManager",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token0",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token1",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "QYP_DCA__InvalidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "QYP_DCA__InvalidDcaIndex",
    type: "error",
  },
  {
    inputs: [],
    name: "QYP_DCA__InvalidFrequency",
    type: "error",
  },
  {
    inputs: [],
    name: "QYP_DCA__InvalidNumberOfOrders",
    type: "error",
  },
  {
    inputs: [],
    name: "QYP_DCA__InvalidPercentage",
    type: "error",
  },
  {
    inputs: [],
    name: "QYP_DCA__InvalidToken",
    type: "error",
  },
  {
    inputs: [],
    name: "QYP_DCA__NoDcaPosition",
    type: "error",
  },
  {
    inputs: [],
    name: "QYP_DCA__UserDoesNotOwnDcaPosition",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "amountPerOrder",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "frequency",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "numberOfOrders",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "dcaIndex",
        type: "uint256",
      },
    ],
    name: "DcaSubmitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token0",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token1",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256",
      },
    ],
    name: "FundsWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "orderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "OrderSubmitted",
    type: "event",
  },
  {
    inputs: [],
    name: "RESOLUTION",
    outputs: [
      {
        internalType: "int24",
        name: "",
        type: "int24",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allDcaPositions",
    outputs: [
      {
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
      {
        internalType: "uint128",
        name: "amountPerOrder",
        type: "uint128",
      },
      {
        internalType: "uint256",
        name: "frequency",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "numberOfOrders",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "creationDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestampLastSubmittedOrder",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "int24",
        name: "percentageLower",
        type: "int24",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "dailyOrderSubmission",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "grid",
    outputs: [
      {
        internalType: "contract IGrid",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "gridAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "makerOrderManager",
    outputs: [
      {
        internalType: "contract IMakerOrderManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_dcaIndex",
        type: "uint256",
      },
    ],
    name: "showDcaInfo",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "orderId",
            type: "uint256",
          },
          {
            internalType: "int24",
            name: "price",
            type: "int24",
          },
          {
            internalType: "uint128",
            name: "makerAmountTotal",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "makerAmountRemaining",
            type: "uint128",
          },
        ],
        internalType: "struct QYP_DCA.Order[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_totalAmount",
        type: "uint256",
      },
      {
        internalType: "uint128",
        name: "_amountPerOrder",
        type: "uint128",
      },
      {
        internalType: "uint256",
        name: "_frequency",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_numberOfOrders",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_tokenIn",
        type: "address",
      },
      {
        internalType: "int24",
        name: "_percentageLower",
        type: "int24",
      },
    ],
    name: "submitDcaPosition",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token0",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token1",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_dcaIndex",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_unwrapWeth",
        type: "bool",
      },
    ],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
