const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("ignisFox Contract", function () {
  let ignisFox;
  let pyroFox;
  let claimContract;
  let owner, addr1, addr2;
  let marketplace = "0x3328358128832A260C76A4141e19E2A943CD4B6D";

  let claimNFTsaddress = "0x5e17b14ADd6c386305A32928F985b29bbA34Eff5";
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy ignisFox contract
    const IgnisFox = await ethers.getContractFactory("ignisFox");
    ignisFox = await IgnisFox.deploy(claimNFTsaddress, marketplace);
    const PyroFox = await ethers.getContractFactory("pyroFox");
    pyroFox = await PyroFox.deploy(
      claimNFTsaddress,
      marketplace,
      await ignisFox.getaddress()
    );
    const ClaimContract = await ethers.getContractFactory("claimNFTs");
    claimContract = await ClaimContract.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const current = await ignisFox.getGamemanager();
      const expected = owner.address;
      assert.equal(current, expected);
    });

    it("Should set the right claim contract address", async function () {
      expect(await ignisFox.getclaimContractAddress()).to.equal(
        claimNFTsaddress
      );
    });

    it("Should set the right marketplace address", async function () {
      expect(await ignisFox.getmarketplace()).to.equal(marketplace);
    });
  });

  describe("Minting and Listing", function () {
    it("Should mint an NFT and assign it to the owner", async function () {
      const sendValue = ethers.parseEther("0.001");
      await ignisFox.purchaseNFT({ value: sendValue });
      expect(await ignisFox.getowner(0)).to.equal(owner.address);
    });
    it("listed item cannot be bought twice", async function () {
      let price = ethers.parseEther("0.001");
      await ignisFox.listItem(0, price);
      await ignisFox.listeditembought(0); //first time bought
      await expect(ignisFox.listeditembought(0)).to.be.reverted;
    });
    it("Should list an item for sale", async function () {
      let price = ethers.parseEther("0.001");
      await ignisFox.listItem(0, price);
      expect(await ignisFox.islisted(0)).to.be.true;
      expect(await ignisFox.fetchPriceOfListedNFT(0)).to.equal(price);
    });
  });
  describe("Claiming NFTs", function () {
    it("Should not allow a user to claim an NFT twice", async function () {
      await ignisFox.claimNFT(await claimContract.getaddress());
      await expect(ignisFox.claimNFT(await claimContract.getaddress())).to.be
        .reverted;
    });
  });
  describe("Level Up and Evolve", function () {
    it("Should upgrade NFT level by purchase", async function () {
      await ignisFox.purchaseNFT({ value: ethers.parseEther("0.001") });
      await ignisFox.upgradeLevelbyPurchase(0, {
        value: ethers.parseEther("0.00001"),
      });
      expect(await ignisFox.getLevel(0)).to.equal(2);
    });
  });

  describe("Transfers", function () {
    it("Should transfer NFT between addresses using transferfrom", async function () {
      await ignisFox.purchaseNFT({ value: ethers.parseEther("0.001") });
      await ignisFox.transferFrom(owner.address, addr1.address, 0);
      expect(await ignisFox.getowner(0)).to.equal(addr1.address);
    });
    it("Should transfer NFT between addresses using safe transferfrom", async function () {
      await ignisFox.purchaseNFT({ value: ethers.parseEther("0.001") });
      await ignisFox.safeTransferFrom(owner.address, addr1.address, 0);
      expect(await ignisFox.getowner(0)).to.equal(addr1.address);
    });
  });
});
