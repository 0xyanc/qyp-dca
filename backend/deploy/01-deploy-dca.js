const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const makerOrderManagerAddress = networkConfig[chainId].MakerOrderManager
    const wethAddress = networkConfig[chainId].WETH
    const usdcAddress = networkConfig[chainId].USDC


    log("--------------------------------------")
    let args = [makerOrderManagerAddress, wethAddress, usdcAddress]
    log("*** Deploying QYP_DCA ***")
    const qypDca = await deploy("QYP_DCA", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })
    log("--------------------------------------")

    //Verify the smart contract 
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN) {
        log("Verifying contracts...")
        await verify(qypDca.address, args)
        log("Contracts Verified")
    }
}

module.exports.tags = ["all", "dca", "main"]