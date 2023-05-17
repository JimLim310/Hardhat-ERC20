import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import {OurToken} from "../../typechain-types"
import { deployments, ethers } from "hardhat"
import { assert, expect } from "chai"
import { INITIAL_SUPPLY } from "../../helper-hardhat-config"

describe("OurToken Unit Test", () => {
    let ourToken: OurToken,
        deployer: SignerWithAddress,
        user1:  SignerWithAddress
    
    beforeEach(async () => {
        const accounts = await ethers.getSigners() 
        deployer = accounts[0]
        user1 = accounts[1]

        await deployments.fixture("all")
        ourToken = await ethers.getContract("OurToken", deployer)
    })

    it("should have correct initial supply of token", async () => {
        const totalSupply = await ourToken.totalSupply()
        assert.equal(totalSupply.toString(), INITIAL_SUPPLY)
    })

    it("should be able to transfer token to an address successfully", async () => {
        const tokensToSend = ethers.utils.parseEther("10")
        await ourToken.transfer(user1.address, tokensToSend)
        expect(await ourToken.balanceOf(user1.address)).to.equal(tokensToSend)
    })

    it("should approve other address to spend token", async () => {
        const tokensToSend = ethers.utils.parseEther("5")
        await ourToken.approve(user1.address, tokensToSend)
        const ourToken1 = await ethers.getContract("OurToken", user1)
        await ourToken1.transferFrom(deployer.address,user1.address,tokensToSend)
        expect(await ourToken1.balanceOf(user1.address)).to.equal(tokensToSend)
    })
})