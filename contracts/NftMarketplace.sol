// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./ignisFox.sol";

contract NftMarketplace {
    address payable gameManager;
    uint256 private commission;
    mapping(address => uint256) private s_proceeds; //links the address to the proceeds due
    uint256 private s_feeBasisPoints = 9800; // 2% fee

    constructor() {
        gameManager = payable(msg.sender);
    }

    event ItemSold(uint256 tokenId, address from, address to);

    function buyItem(address nft, uint256 tokenId) public payable {
        ignisFox nftContract = ignisFox(nft);

        address tokenOwner = nftContract.ownerOf(tokenId);
        address buyer = msg.sender;

        uint256 priceOfNft = nftContract.fetchPriceOfListedNFT(tokenId);
        require(msg.value == priceOfNft, "Not Enough Ethers");
        address payable owner = payable(nftContract.ownerOf(tokenId));

        // Check if buyer is not the owner of the token
        require(tokenOwner != buyer, "Buyer already owns this token");
        uint256 cost = (msg.value * s_feeBasisPoints) / 10000;
        //we will keep a 2% cut on all transactions
        s_proceeds[owner] += cost; //proceeds given to seller
        commission += priceOfNft - cost; // proceeds transferred to Us

        // Transfer the token to the buyer
        nftContract.safeTransferFrom(tokenOwner, buyer, tokenId);
        nftContract.listeditembought(tokenId);
        owner.transfer(msg.value);

        // Emit the ItemSold event
        emit ItemSold(tokenId, tokenOwner, buyer);
    }

    function getProceeds() public view returns (uint256) {
        return s_proceeds[msg.sender]; //to check pending dues
    }

    //returning money
    function withdrawProceeds() external {
        uint256 proceeds = s_proceeds[msg.sender];
        require(proceeds >= 0, "price is less than 0");
        s_proceeds[msg.sender] = 0;
        (bool success1, ) = payable(msg.sender).call{value: proceeds}(""); //paying the seller
        require(success1, "Transfer failed");
        (bool success2, ) = payable(msg.sender).call{value: commission}(""); //paying the game manager
        commission = 0;
        require(success2, "Transfer failed");
    }
}
