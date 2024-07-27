const { expect } = require("chai");

describe("claimContract Contract", function () {
  let claimContract;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    const ClaimContract = await ethers.getContractFactory("claimNFTs");
    claimContract = await ClaimContract.deploy();
  });
  describe("ifHeClaimedAlready", function () {
    it("should return true if the address has not claimed", async function () {
      expect(await claimContract.ifHeClaimedAlready(addr1.address)).to.equal(
        true
      );
    });

    it("should revert with 'youve claimed' if the address has claimed", async function () {
      await claimContract.hasClaimed(addr1.address);
      await expect(
        claimContract.ifHeClaimedAlready(addr1.address)
      ).to.be.revertedWith("youve claimed");
    });
  });
});
