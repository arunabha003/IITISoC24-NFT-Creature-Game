// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./claimNFTs.sol";
import "./pyroFox.sol";

contract ignisFox is ERC721URIStorage {
    uint256 private s_tokenCounter; //token counter
    mapping(uint256 => bool) public isListed; //checks if the particular nft is listed
    mapping(uint256 => uint256) public tokenToPrice; //returns the price of the token id if it has been listed
    mapping(uint256 => uint256) tokenToCreatureLevel; // returns the creature level of the nft
    address public marketplace; //marketplace address
    address  payable public gameManager; // the game managers address
    address public claimContractAddress; //claim contract address(one time use)
    uint256[] public listedItemsArray; //token ids of listed items
    event ItemListed(uint256 tokenId, address marketplace);

    string public constant TOKEN_URI =
        "https://arweave.net/NX8bgt_tAInNCZBghiieHtorhmxTWvPXt4uaIfZsl8s";

    constructor(address _claimContract, address _marketplace)
        ERC721("Ignis Fox", "IGNIS")
    {
        getNFT();
        gameManager = payable(msg.sender);
        claimContractAddress = _claimContract;
        marketplace = _marketplace;
    }
        function getclaimContractAddress() public view  returns (address){
        return claimContractAddress;
    }
           function getmarketplace() public view  returns (address){
        return marketplace;
    }
               function getowner(uint256 tokenId) public view  returns (address){
        return ownerOf(tokenId);
    }

    function claimNFT() public returns (uint256) {
        claimNFTs claimContract = claimNFTs(claimContractAddress);
        require(claimContract.ifHeClaimedAlready(msg.sender));
        claimContract.hasClaimed(msg.sender);
        getNFT();
        return s_tokenCounter - 1;
    }

    function getNFT() public {
        _safeMint(msg.sender, s_tokenCounter);
        tokenToCreatureLevel[s_tokenCounter] = 1; //initial level 1
        _setTokenURI(s_tokenCounter, TOKEN_URI);
        s_tokenCounter += 1;
    }

    function purchaseNFT() public payable returns (uint256) {
        require(msg.value == 1 ether, "Incorrect Value Sent");
        getNFT();
        return s_tokenCounter - 1;
    }

    function upgradeLevelbyPurchase(uint256 _tokenID) public payable {
        require(
            tokenToCreatureLevel[_tokenID] <= 25,
            "Critter reached max level, no further upgradation"
        ); //max level of stage 1 will be 25
        require(msg.value == 1 ether, "Incorrect Value Sent");
        tokenToCreatureLevel[_tokenID]++;
    }

    function getLevel(uint256 _tokenID) public view returns (uint256) {
        return tokenToCreatureLevel[_tokenID];
    }

    function listeditembought(uint256 _tokenID) public {
        isListed[_tokenID] = false;
        listedItemsArray.pop();
    }

    function listItem(uint256 tokenId, uint256 priceinwei)
        public
        returns (bool)
    {
        require(
            msg.sender == ownerOf(tokenId),
            "You are not the Owner of Token to List it for sale"
        );
        require(isListed[tokenId] == false);
        approve(marketplace, tokenId);
        tokenToPrice[tokenId] = priceinwei ;
        emit ItemListed(tokenId, marketplace);
        isListed[tokenId] = true;
        listedItemsArray.push(tokenId); // add to listed items array
        return true;
    }

    function evolve(uint256 tokenId, address pyrofoxAddress)
        public
        returns (uint256)
    {
        require(
            msg.sender == ownerOf(tokenId),
            "You are not the Owner of Token"
        );
        require(
            tokenToCreatureLevel[tokenId] == 25,
            "Reach level 25 to evolve"
        );
        address _youraddress = msg.sender;
        safeTransferFrom(msg.sender, gameManager, tokenId); //Transfer of stage 1 to gameManager
        //pyrofox contract functions
        pyroFox pyrofoxContract = pyroFox(pyrofoxAddress); //contract instance
        uint256 tokenIDofPyro = pyrofoxContract.evolvepyro(_youraddress); // minting of pyro
        return tokenIDofPyro;
    }

    function forceevolve(uint256 _tokenID) public {
        tokenToCreatureLevel[_tokenID] = 25; // Corrected assignment
    }
    function getaddress() public view returns(address){
        return address(this);
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
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override(IERC721, ERC721) {
        super.safeTransferFrom(from, to, tokenId, _data);
    }
}
