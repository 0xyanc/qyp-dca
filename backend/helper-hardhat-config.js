const networkConfig = {
    31337: {
        name: "localhost",
        //these are the addresses on arbitrum mainnet since we are forking it
        MakerOrderManager: "0x36E56CC52d7A0Af506D1656765510cd930fF1595",
        WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
        GELATO_NETWORK: "0x4775aF8FEf4809fE10bf05867d2b038a4b5B2146",
        GELATO_AUTOMATE: "0xB3f5503f93d5Ef84b06993a1975B9D21B962892F",
        GELATO_TASK: "0xB2f34fd4C16e656163dADFeEaE4Ae0c1F13b140A"

    },
    5: {
        name: "goerli",
        MakerOrderManager: "0x36E56CC52d7A0Af506D1656765510cd930fF1595",
        WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
    }
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}