import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, BigNumber, Signer } from "ethers";
import { parseEther } from "ethers/lib/utils";
import hre, { ethers } from "hardhat";


describe("DEX Token", function () {

  let signers: Signer[];

  let dexToken: Contract;
  let asad20:any;
  let user:any;
  let owner:any;
  let user2,user3:any;



  before(async () => {
    [owner, user, user2, user3] = await ethers.getSigners();

    hre.tracer.nameTags[await owner.address] = "ADMIN";
    hre.tracer.nameTags[await user.address] = "USER1";

    const Asad20 = await ethers.getContractFactory("Asad20", owner);
    asad20 = await Asad20.deploy();

    const DEX = await ethers.getContractFactory("DEX", owner);
    dexToken = await DEX.deploy(asad20.address);

    hre.tracer.nameTags[dexToken.address] = "DEX-TOKEN";
  });


  it("Buy Token without transfer token to contract", async function () {
    await expect( dexToken.connect(user).buy(({value:parseEther("3")}))).to.be.revertedWith("Not enough tokens in the reserve")
  })
  it("Buy Token without Amount", async function () {
    await expect(dexToken.connect(user).buy()).to.be.revertedWith("You need to send some ether")
  })

  it("should Transfer Token to DEX Contract", async function () {
    await asad20.transfer(dexToken.address,1000)
    console.log(asad20.functions);
    console.log(dexToken.functions)
  })


  it("Dex Token Balance", async function () {
    expect(await dexToken.getBalanceOfToken()).to.be.equal(1000)
  })


 it("Buy Token", async function () {
    await dexToken.connect(user).buy(({value:parseEther("2")}))
  })

  it("User Token Balance", async function () {
    expect(await asad20.balanceOf(user.address)).to.be.equal(200)
  })

  it("Dex Token Balance", async function () {
    expect(await dexToken.getBalanceOfToken()).to.be.equal(800)
  })

  it("Approve  Token for Sell", async function () {
    await asad20.connect(user).approve(dexToken.address,100)
  })

  it(" Token Sell without Amount", async function () {
    await expect(dexToken.connect(user).sell(0)).to.be.revertedWith("You need to sell at least some tokens")
  })

  it(" Token Sell Greater Amount", async function () {
    await expect(dexToken.connect(user).sell(250)).to.be.revertedWith("Check the token allowance")
  })

  it("Sell Token", async function () {
    await dexToken.connect(user).sell(100)
  })

  it("Approve  Token for Sell", async function () {
    await asad20.connect(user).approve(dexToken.address,200)
  })
  it("Sell Token", async function () {
    await expect( dexToken.connect(user).sell(150)).to.be.revertedWith("ERC20: transfer amount exceeds balance")
  })

  it("User Token Balance", async function () {
    expect(await asad20.balanceOf(user.address)).to.be.equal(100)
  })

  it("Dex Token Balance", async function () {
    expect(await dexToken.getBalanceOfToken()).to.be.equal(900)
  })



});