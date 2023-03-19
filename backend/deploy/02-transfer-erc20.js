const { network, ethers } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (chainId == 31337) {
        const wethAddress = networkConfig[chainId].WETH
        const usdcAddress = networkConfig[chainId].USDC

        // Send some ERC20 to my contract
        // by trying to impersonate a whale and sending stuff from their accounts
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: ["0xD07E37862B11CA2186922F1c71f61D952d2b93e8"],
        });
        const signerWETH = ethers.provider.getSigner("0xD07E37862B11CA2186922F1c71f61D952d2b93e8");
        signerWETH.address = signerWETH._address;
        wethContract = await hre.ethers.getContractAt("IERC20Upgradeable", wethAddress, signerWETH);
        wethContract = wethContract.connect(signerWETH);
        await wethContract.transfer(deployer, ethers.utils.parseEther("5"));

        // Send some ERC20 to my contract
        // by trying to impersonate a whale and sending stuff from their accounts
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: ["0x466ead4273c8962a25711d8ff922e208606314d0"],
        });
        const signerUSDC = ethers.provider.getSigner("0x466ead4273c8962a25711d8ff922e208606314d0");
        signerUSDC.address = signerUSDC._address;
        usdcContract = await hre.ethers.getContractAt("IERC20Upgradeable", usdcAddress, signerUSDC);
        usdcContract = usdcContract.connect(signerUSDC);
        // console.log(deployer)
        // await usdcContract.transfer(deployer, ethers.utils.parseEther("2800000"));
        await usdcContract.transfer(deployer, ethers.utils.parseUnits("4000000", 6));
    }

}
