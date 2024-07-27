// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract pyroFox is ERC721URIStorage {
    uint256 public s_tokenCounter; //token counter
    mapping(uint256 => bool) public isListed; //checks if the particular nft is listed
    mapping(uint256 => uint256) public tokenToPrice; //returns the price of the token id if it has been listed
    mapping(uint256 => uint256) tokenToCreatureLevel; // returns the creature level of the nft
    address public marketplace; //marketplace address
    address payable gameManager; // the game managers address
    address public claimContractAddress; //claim contract address(one time use)
    uint256[] public listedItemsArray; //token ids of listed items
    event ItemListed(uint256 tokenId, address marketplace);
    address public ignisFoxAddress;

    string public constant TOKEN_URI =
        "https://arweave.net/NX8bgt_tAInNCZBghiieHtorhmxTWvPXt4uaIfZsl8s";

    constructor(
        address _claimContract,
        address _marketplace,
        address _ignisFoxAddress
    ) ERC721("Pyro Fox", "PYX") {
        gameManager = payable(msg.sender);
        claimContractAddress = _claimContract;
        ignisFoxAddress = _ignisFoxAddress;
        marketplace = _marketplace;
    }

    function evolvepyro(address _youraddress) public returns (uint256) {
        _safeMint(_youraddress, s_tokenCounter);
        tokenToCreatureLevel[s_tokenCounter] = 26; //initial level 26
        _setTokenURI(s_tokenCounter, TOKEN_URI);
        s_tokenCounter += 1;

        return s_tokenCounter - 1;
    }

    function purchaseNFT() public payable returns (uint256) {
        require(msg.value == 1000000000, "Incorrect Value Sent");
        _safeMint(msg.sender, s_tokenCounter);
        tokenToCreatureLevel[s_tokenCounter] = 26;
        _setTokenURI(s_tokenCounter, TOKEN_URI);
        s_tokenCounter += 1;
        return s_tokenCounter - 1;
    }

    function upgradeLevelbyPurchase(uint256 _tokenID) public payable {
        require(
            tokenToCreatureLevel[_tokenID] <= 25,
            "Critter reached max level, no further upgradation"
        ); //max level of stage 1 will be 25
        require(msg.value == 1000000000, "Incorrect Value Sent");
        tokenToCreatureLevel[_tokenID]++;
    }

    function getLevel(uint256 _tokenID) public view returns (uint256) {
        return tokenToCreatureLevel[_tokenID];
    }

    function listeditembought(uint256 _tokenID) public {
        isListed[_tokenID] = false;
        listedItemsArray.pop();
    }

    function listItem(uint256 tokenId, uint256 priceIngwei)
        public
        returns (bool)
    {
        require(
            msg.sender == ownerOf(tokenId),
            "You are not the Owner of Token to List it for sale"
        );
        require(isListed[tokenId] == false);
        approve(marketplace, tokenId);
        tokenToPrice[tokenId] = priceIngwei * 1e9;
        emit ItemListed(tokenId, marketplace);
        isListed[tokenId] = true;
        listedItemsArray.push(tokenId); // add to listed items array
        return true;
    }

    function fetchPriceOfListedNFT(uint256 tokenId)
        public
        view
        returns (uint256)
    {
        return tokenToPrice[tokenId];
    }

    function islisted(uint256 tokenId) public view returns (bool) {
        return isListed[tokenId];
    }

    function getListedItems() public view returns (uint256[] memory) {
        return listedItemsArray;
    }

    function removeApproval(uint256 tokenId) public {
        approve(address(0), tokenId);
        isListed[tokenId] = false;
        // Optional: remove from listedItemsArray if needed
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override(IERC721, ERC721) {
        super.transferFrom(from, to, tokenId); // calls the function that was previously there in ERC721 before overriding
        require(
            msg.sender == marketplace,
            "Only marketplace can do such transactions, no direct transactions allowed"
        );
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override(IERC721, ERC721) {
        super.safeTransferFrom(from, to, tokenId, _data);
        require(
            msg.sender == marketplace,
            "Only marketplace can do such transactions, no direct transactions allowed"
        );
    }
}
