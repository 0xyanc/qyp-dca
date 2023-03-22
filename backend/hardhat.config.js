require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy");
require("hardhat-gas-reporter")
require("solidity-coverage")
require("@nomicfoundation/hardhat-chai-matchers")

const PK = process.env.PK || "";
const ARBISCAN = process.env.ARBISCAN || "";
const ETHERSCAN = process.env.ETHERSCAN || "";
const ALCHEMY_GOERLI = process.env.ALCHEMY_GOERLI || "";
const ALCHEMY_ARBI_MAINNET = process.env.ALCHEMY_ARBI_MAINNET || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    },
    hardhat: {
      chainId: 31337,
      forking: {
        url: ALCHEMY_ARBI_MAINNET,
        // arbitrum block 18th March 2023 10:50 AM
        blockNumber: 71049942
      }
    },
    goerli: {
      url: ALCHEMY_GOERLI,
      accounts: [`0x${PK}`],
      chainId: 5,
      blockConfirmations: 6
    },
    arbitrum: {
      url: ALCHEMY_ARBI_MAINNET,
      accounts: [`0x${PK}`],
      chainId: 42161,
      blockConfirmations: 6
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.18"
      },
      {
        version: "0.6.11"
      },
      {
        version: "0.8.9"
      }
    ]
  },
  etherscan: {
    apiKey: ARBISCAN
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
    investor: {
      default: 1,
      1: 1,
    },
  },
  gasReporter: {
    enabled: true
  }
};
