const networkConfig = {
    31337: {
        name: "localhost",
        //these are the addresses on arbitrum mainnet since we are forking it
        MakerOrderManager: "0x36E56CC52d7A0Af506D1656765510cd930fF1595",
        WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        USDC: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
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