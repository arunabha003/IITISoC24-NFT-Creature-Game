const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("pyroFox", function () {
  let pyroFox, owner, addr1, addr2, ignisFox, claimContract;
  let claimNFTsaddress = "0x5e17b14ADd6c386305A32928F985b29bbA34Eff5";
  let marketplace = "0x3328358128832A260C76A4141e19E2A943CD4B6D";

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const IgnisFox = await ethers.getContractFactory("ignisFox");
    ignisFox = await IgnisFox.deploy(claimNFTsaddress, marketplace);

    const PyroFox = await ethers.getContractFactory("pyroFox");
    pyroFox = await PyroFox.deploy(
      claimNFTsaddress,
      marketplace,
      await ignisFox.getaddress()
    );
    const Blazehound = await ethers.getContractFactory("blazehound");
    blazehound = await Blazehound.deploy(
      claimNFTsaddress,
      marketplace,
      await pyroFox.getaddress()
    );
    const ClaimContract = await ethers.getContractFactory("claimNFTs");
    claimContract = await ClaimContract.deploy();
  });

  describe("NFT Operations", function () {
    it("Should evolve to a pyro fox", async function () {
      await pyroFox.evolvepyro(addr1.address);
      expect(await pyroFox.ownerOf(0)).to.equal(addr1.address);
      expect(await pyroFox.getLevel(0)).to.equal(21);
    });

    it("Should purchase an NFT", async function () {
      await pyroFox.purchaseNFT({ value: ethers.parseEther("0.002") });

      expect(await pyroFox.ownerOf(0)).to.equal(owner.address);
      expect(await pyroFox.getLevel(0)).to.equal(21);
    });

    it("Should upgrade the level by purchase", async function () {
      await pyroFox.purchaseNFT({ value: ethers.parseEther("0.002") });
      await pyroFox.upgradeLevelbyPurchase(0, {
        value: ethers.parseEther("0.00002"),
      });
      expect(await pyroFox.getLevel(0)).to.equal(22);
    });

    it("Should list an item", async function () {
      await pyroFox.evolvepyro(addr1.address);
      await pyroFox.connect(addr1).listItem(0, 1);
      expect(await pyroFox.islisted(0)).to.be.true;
    });

    it("Should fetch the price of a listed NFT", async function () {
      const priceInWei = ethers.parseUnits("1", "wei"); // Use wei for consistency
      await pyroFox.purchaseNFT({ value: ethers.parseEther("0.002") }); // Ensure this matches the expected value
      await pyroFox.listItem(0, priceInWei);
      expect(await pyroFox.fetchPriceOfListedNFT(0)).to.equal(priceInWei);
    });

    it("Should remove approval and delist an item", async function () {
      await pyroFox.evolvepyro(addr1.address);
      await pyroFox.connect(addr1).listItem(0, 1);
      await pyroFox.connect(addr1).removeApproval(0);
      expect(await pyroFox.islisted(0)).to.be.false;
    });
  });

  describe("Level Up and Evolve", function () {
    it("Should upgrade NFT level by purchase", async function () {
      await pyroFox.purchaseNFT({ value: ethers.parseEther("0.002") });
      await pyroFox.upgradeLevelbyPurchase(0, {
        value: ethers.parseEther("0.00002"),
      });
      expect(await pyroFox.getLevel(0)).to.equal(22);
    });
  });
});
