import React, { useState, useEffect } from 'react';
import useCritters from '../useCritters';
import { ethers } from 'ethers';
import { ABI } from '../nftABI';
import { connectMetamask } from '../../utils/connectMetamask.js';
import axios from 'axios';
import Navbar from '../Navbar.jsx'


const Sell = () => {
  axios.defaults.withCredentials = true;

  const { allCritterData } = useCritters();
  const [selectedCritter, setSelectedCritter] = useState({ name: '', tokenAddress: '', tokenId: '', critterImageUrl: '' });
  const [selectedCritterLevel, setSelectedCritterLevel] = useState(null);
  const [selectedCritterTokenId, setSelectedCritterTokenId] = useState(null);
  const [signer, setSigner] = useState(null);
  const [connectedUserAddress, setConnectedUserAddress] = useState(null);
  const [priceEntered, setPriceEntered] = useState('');

  async function useMetamask() {
    const { connectedWalletAddress, signer } = await connectMetamask();
    setSigner(signer);
    setConnectedUserAddress(connectedWalletAddress);
  }

  useEffect(() => {
    useMetamask();
  }, []);

  useEffect(() => {
    if (connectedUserAddress) {
      if (walletVerification()) {
        console.log("Wallet verified.");
      } else {
        console.log("Connect on same wallet");
      }
    }
  }, [connectedUserAddress]);

  // Function to verify wallet
  const walletVerification = async () => {
    const response = await axios.post('http://localhost:5000/api/v1/check/onSameWallet', { connectedAddress: connectedUserAddress }, { withCredentials: true });
    const { isValid } = response.data;

    if (!isValid) {
      console.log('Connect same wallet as of the user');
      return isValid;
    }
    return isValid;
  };

  async function fetchLevel(nftaddress, tokenId) {
    if (window.ethereum !== 'undefined') {
      const contract = new ethers.Contract(nftaddress.toString(), ABI, signer);
      try {
        const level = await contract.getLevel(tokenId);
        const levelToString = level.toString();
        setSelectedCritterLevel(levelToString);
        console.log(levelToString);
      } catch (error) {
        console.log("Error fetching level : Connect Metamask Correctly");
      }
    }
  }

  async function listItem(nftaddress, price, tokenId) {
    if (window.ethereum !== 'undefined') {
      console.log("pice: ",price)
      const contract = new ethers.Contract(nftaddress.toString(), ABI, signer);
      try {
        const tx = await contract.listItem(tokenId, price);
        const receipt = await tx.wait();
        return true
      } catch (error) {
        console.log("Error listing item : Connect Metamask Correctly", error);
      }
    }
  }

  useEffect(() => {
    if (selectedCritterTokenId) {
      fetchLevel(selectedCritter.tokenAddress, selectedCritter.tokenId);
    }
  }, [selectedCritterTokenId]);

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    const selected = allCritterData.find(critter => critter._id === selectedId);
    console.log(selected)
    setSelectedCritter({
      name: selected.name,
      tokenAddress: selected.tokenAddress,
      tokenId: selected.tokenId,
      critterImageUrl: selected.critterImageUrl,
      databaseId : selected._id
    });
    setSelectedCritterTokenId(selected.tokenId);
  };

  async function onHandleSubmit() {
    const price = parseFloat(priceEntered); // Ensure the price is a number
    const tx = await listItem(selectedCritter.tokenAddress, price, selectedCritter.tokenId);
    if(tx){
      console.log("transaction made successfully listed , database code")
      console.log(selectedCritter.databaseId)
      console.log({
        id:selectedCritter.databaseId
      })
      try {
        await axios.post("http://localhost:5000/api/v1/critter/listItem",{id:selectedCritter.databaseId},{withCredentials:true})
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleInput = (event) => {
    console.log(event.target.value.toString())
    setPriceEntered(event.target.value.toString());
  };

  return (
    <div>
      <Navbar />
      <h2>Sell Form</h2>
      Connected Wallet Address: {connectedUserAddress}
      {allCritterData ? (
        <>
          <select value={selectedCritter.name} onChange={handleSelectChange}>
            <option value="" disabled>
              Select a critter
            </option>
            {allCritterData.map((critter) => (
              <option key={critter._id} value={critter._id}>
                {critter.nickname.trim()!=""?critter.nickname:critter.name}
              </option>
            ))}
          </select>
        </>
      ) : (
        <p>Try to login again!</p>
      )}
      {selectedCritter && (
        <>
          <p>Selected Critter: {selectedCritter.name}</p>
          <p>Token Address: {selectedCritter.tokenAddress}</p>
          <p>Token ID: {selectedCritter.tokenId}</p>
          <p>Image: <img src={selectedCritter.critterImageUrl} alt={selectedCritter.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} /></p>
        </>
      )}
      {selectedCritterLevel && (
        <>
          <p>Level: {selectedCritterLevel}</p>
        </>
      )}

      <form>
        <input onChange={handleInput} name='price' placeholder='Enter Price' value={priceEntered} />
      </form>
      {priceEntered}
      <div>
        <button onClick={onHandleSubmit}>Sell!</button>
      </div>
    </div>
  );
};

export default Sell;
