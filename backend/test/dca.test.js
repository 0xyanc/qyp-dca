const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

if (!developmentChains.includes(network.name)) {
    describe.skip
    return
}
describe("Unit tests QYP_DCA contracts", function () {
    let accounts
    let qypDca
    let makerOrderManager
    let grid
    before(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        deployerAddress = await deployer.getAddress()
        investor = accounts[1]
        investorAddress = await investor.getAddress()
    })

    describe("submit dca position", async function () {
        beforeEach(async () => {
            await deployments.fixture(["dca"])
            qypDca = await ethers.getContract("QYP_DCA")
            const chainId = network.config.chainId
            const makerOrderManagerAddress = networkConfig[chainId].MakerOrderManager
            makerOrderManager = await ethers.getContractAt("IMakerOrderManager", makerOrderManagerAddress, deployer)
            const wethAddress = networkConfig[chainId].WETH
            wethContract = await ethers.getContractAt("IERC20Upgradeable", wethAddress, deployer)

            // Send some ERC20 to my contract
            // by trying to impersonate a whale and sending stuff from their accounts
            await hre.network.provider.request({
                method: "hardhat_impersonateAccount",
                params: ["0xD07E37862B11CA2186922F1c71f61D952d2b93e8"],
            });
            const signer = ethers.provider.getSigner("0xD07E37862B11CA2186922F1c71f61D952d2b93e8");
            signer.address = signer._address;
            wethContract = await hre.ethers.getContractAt("IERC20Upgradeable", wethAddress, signer);
            wethContract = wethContract.connect(signer);

            await wethContract.transfer(deployer.address, ethers.utils.parseEther("5"));
            // const balance = await wethContract.balanceOf(deployer.address)
            // console.log(balance.toString())
            await wethContract.connect(deployer).approve(qypDca.address, ethers.constants.MaxUint256)
            const gridAddress = await qypDca.grid()
            grid = await hre.ethers.getContractAt("Grid", gridAddress, deployer);
            // console.log(grid.address)
        })

        it("should submit the dca position and emit events", async function () {
            const totalAmount = ethers.utils.parseEther("5")
            const amountPerOrder = ethers.utils.parseEther("1")
            const frequency = 3600
            const numberOfOrders = 5
            const wethToken = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
            const price = "1800"
            const dca = await qypDca.submitDcaPosition(totalAmount, amountPerOrder, frequency, numberOfOrders, wethToken, price)
            const userPosition = await qypDca.usersPositions(deployer.address, 0)
            // console.log(userPosition)
            await expect(dca).to.emit(qypDca, "DcaSubmitted")
            // await expect(dca).to.changeTokenBalance(wethContract, [deployer, qypDca], [-totalAmount, totalAmount])
            await expect(dca).to.emit(wethContract, "Transfer").withArgs(deployerAddress, qypDca.address, totalAmount)
            await expect(dca).to.emit(grid, "PlaceMakerOrder")
        })
    })
})
