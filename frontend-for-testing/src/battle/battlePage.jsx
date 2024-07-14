import React, { useEffect, useState } from 'react';
import CritterCard from "../yourCritterCard.jsx";
import { connectMetamask } from '../../utils/connectMetamask.js';
import { ethers } from 'ethers';
import { ABI } from '../crittersABI.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { initSocket, getSocket } from '../battle/WebSocketService.js'; // Import getSocket

const BattlePage = () => {
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = initSocket();
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
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


  const [clientDetails, setClientDetails] = useState(null);
  const [opponent, setOpponent] = useState({});
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);
  const [player, setPlayer] = useState(100);
  const [roomId, setRoomId] = useState(null); // Change to null initially

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
      console.log({ ...selectedCritterData, ...userData, level: selectedCritterLevel })
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
        setRoomId(roomId); // Set roomId when match is found
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

  // Listen for updates from socket
  useEffect(() => {
    if (socket) {
      socket.on('matchFound', ({ player, clientDetails, opponent }) => {
        setPlayer(player)
        setClientDetails(clientDetails);
        setOpponent(opponent);
      });

      socket.on('updateHealth', ({ player1Health, player2Health }) => {
        setPlayer1Health(player1Health);
        setPlayer2Health(player2Health);
      });

      socket.on('gameOver', ({ winner }) => {
        navigate('/results', { state: { results: { result: winner === player ? 'won' : 'lost', reward: null } } });
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <>
      Battle Now!
      <br />
      <div>
        <h3>Your Critters !</h3>
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

      {/* Battle Interface */}
      {clientDetails && opponent && (
        <div>
          <h2>FIGHT!! Room ID : {roomId}</h2>
          <div>
            <div id='us'>
              <h3>Your Info</h3>
              <CritterCard critter={clientDetails} />
              <img src={clientDetails.critterImageUrl} alt="Your Critter" />
              <div>
                <h3>Your Health:</h3>
                <p>{player === 1 ? player1Health : player2Health}</p>
              </div>
            </div>
            <div id='opponent'>
            <CritterCard critter={opponent} />
              <h3>Opponent: {opponent.username}</h3>
              <img src={opponent.critterImageUrl} alt="Opponent's Critter" />
              <div>
                <h3>Opponent's Health:</h3>
                <p>{player === 1 ? player2Health : player1Health}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BattlePage;
