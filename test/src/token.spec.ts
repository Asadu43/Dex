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

    hre.tracer.nameTags[dexToken.address] = "TEST-TOKEN";
  });


  it("should Approve and Transfer Token to DEX Contract", async function () {

    await asad20.approve(dexToken.address,10000)
    await asad20.transfer(dexToken.address,1000)
    console.log(asad20.functions);
    console.log(dexToken.functions)
  })


  it("Dex Token Balance", async function () {
    expect(await dexToken.getBalanceOfToken()).to.be.equal(1000)
  })


 it("Buy Token", async function () {
    await dexToken.connect(user).buy(({value:parseEther("2")}))
    console.log(await BigNumber.from(await asad20.balanceOf(user.address)))
    console.log(await dexToken.getBalanceOfToken())
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



  it("Sell Token", async function () {
    await dexToken.connect(user).sell(100)
    console.log(await dexToken.getBalanceOfToken())
  })

  it("User Token Balance", async function () {
    expect(await asad20.balanceOf(user.address)).to.be.equal(100)
  })

  it("Dex Token Balance", async function () {
    expect(await dexToken.getBalanceOfToken()).to.be.equal(900)
  })

});