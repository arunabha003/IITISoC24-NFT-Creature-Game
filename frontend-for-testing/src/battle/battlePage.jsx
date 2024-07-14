import React, { useEffect, useState } from 'react';
import CritterCard from "../yourCritterCard.jsx";
import { connectMetamask } from '../../utils/connectMetamask.js';
import io from 'socket.io-client';
import { ethers } from 'ethers';
import { ABI } from '../crittersABI.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BattlePage = () => {
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null); // State for socket connection

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:5001", {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Other state variables
  const [sendFighterInfoStatus, setSendFighterInfoStatus] = useState(null);
  const [userData, setUserData] = useState({});
  const [fighterInfo, setFighterInfo] = useState(null);
  const [connectedUserAddress, setConnectedUserAddress] = useState(null);
  const [allCritterData, setAllCritterData] = useState(null);
  const [startMatch, setStartMatch] = useState("Fight!");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [selectedCritterLevel, setSelectedCritterLevel] = useState(null);
  const [critterAddress, setCritterAddress] = useState(null);
  const [selectedCritterData, setSelectedCritterData] = useState(null);

  axios.defaults.withCredentials = true;

  // Function to connect Metamask
  async function useMetamask() {
    const { connectedWalletAddress, provider, signer } = await connectMetamask();
    setProvider(provider);
    setSigner(signer);
    setConnectedUserAddress(connectedWalletAddress);
  }

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

  // Function to fetch critter level
  async function fetchLevel(nftaddress, tokenId) {
    if (window.ethereum !== 'undefined') {
      const contract = new ethers.Contract(nftaddress.toString(), ABI, signer);
      try {
        const level = await contract.getLevel(tokenId);
        const levelToString = level.toString();
        setSelectedCritterLevel(levelToString);
      } catch (error) {
        console.log("Error fetching level : Connect Metamask Correctly");
      }
    }
  }

  // Function to fetch user profile
  async function fetchUserProfile() {
    const response = await axios.get("http://localhost:5000/api/v1/user/profile", { withCredentials: true });
    setUserData(response.data);
  }

  // Function to fetch all critters
  const fetchData = async () => {
    const fetched = await axios.get("http://localhost:5000/api/v1/critter/fetchCritters", { withCredentials: true });
    setAllCritterData(fetched.data);
  };

  useEffect(() => {
    useMetamask();
  }, []);

  useEffect(() => {
    if (connectedUserAddress) {
      if (walletVerification()) {
        fetchUserProfile();
        fetchData();
      } else {
        console.log("connect on same wallet");
      }
    }
  }, [connectedUserAddress]);

  useEffect(() => {
    if (critterAddress && selectedCritterData) {
      fetchLevel(critterAddress, selectedCritterData.tokenId);
    }
  }, [critterAddress, selectedCritterData]);

  useEffect(() => {
    if (selectedCritterLevel) {
      setFighterInfo({ ...selectedCritterData, ...userData, level: selectedCritterLevel });
      setSendFighterInfoStatus("sending");
    }
  }, [selectedCritterLevel]);

  // Function to handle critter selection
  const handleSubmit = (critter) => {
    setSelectedCritterData(critter);
    setCritterAddress(critter.tokenAddress);
  };

  // Function to handle matchmaking
  const matchmaking = (e) => {
    if (fighterInfo) {
      setStartMatch("Matchmaking...");
      socket.once('matchFound', ({ roomId }) => {
        navigate(`/battleground/${roomId}`);
      });
      setSendFighterInfoStatus(null);
    } else {
      e.preventDefault();
      alert("Select Critter to Match With");
    }
  };

  useEffect(() => {
    if (sendFighterInfoStatus === "sending" && fighterInfo) {
      socket.emit('fighterInfo', fighterInfo);
    }
  }, [sendFighterInfoStatus, fighterInfo, socket]);

  return (
    <>
      Battle Now!
      <br />
      <div>
        <h1>Your Critters !</h1>
        {allCritterData && (
          <>
            {allCritterData.map(critter => (
              <div key={critter._id}>
                <CritterCard critter={critter} />
                <button onClick={() => handleSubmit(critter)}>Select</button>
              </div>
            ))}
          </>
        )}
        <button onClick={matchmaking}>{startMatch}</button>
      </div>
    </>
  );
};

export default BattlePage;
