// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract claimNFTs {

    mapping(address=>bool) claimersTOClaimed;
    
    function ifHeClaimedAlready(address _address) public view returns(bool) {
        require(claimersTOClaimed[_address]!=true);
        return true;
    }
    function hasClaimed(address _address) public{
        claimersTOClaimed[_address]=true;
    }

}