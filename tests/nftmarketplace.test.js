const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("NftMarketplace", function () {
  let ignisFox;
  let NftMarketplace, nftMarketplace, owner, addr1, addr2, nft;
  let claimNFTsaddress = "0x5e17b14ADd6c386305A32928F985b29bbA34Eff5";
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const NftMarketplace = await ethers.getContractFactory("NftMarketplace");
    nftMarketplace = await NftMarketplace.deploy();
    const IgnisFox = await ethers.getContractFactory("ignisFox");
    ignisFox = await IgnisFox.deploy(
      claimNFTsaddress,
      await nftMarketplace.getaddress()
    );
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const current = await nftMarketplace.getGamemanager();
      const expected = owner.address;
      assert.equal(current, expected);
    });
  });

  describe("Transactions", function () {
    it("Should buy an NFT", async function () {
      const tokenId = 0;
      let price = ethers.parseEther("1");
      await ignisFox.connect(owner).listItem(0, price);
      await expect(
        nftMarketplace
          .connect(addr1)
          .buyItem(await ignisFox.getaddress(), tokenId, { value: price })
      )
        .to.emit(nftMarketplace, "ItemSold")
        .withArgs(tokenId, owner.address, addr1.address);

      expect(await ignisFox.ownerOf(tokenId)).to.equal(addr1.address);
    });

    it("Should revert if not enough ether is sent", async function () {
      const tokenId = 0;
      let price = ethers.parseEther("1");
      await ignisFox.connect(owner).listItem(0, price);

      await expect(
        nftMarketplace
          .connect(addr1)
          .buyItem(await ignisFox.getaddress(), tokenId, {
            value: ethers.parseEther("0.5"),
          })
      ).to.be.reverted;
    });
  });
});
