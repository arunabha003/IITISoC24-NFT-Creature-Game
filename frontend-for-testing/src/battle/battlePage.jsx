import React, { useEffect, useState } from 'react';
import CritterCard from "../yourCritterCard.jsx";
import { connectMetamask } from '../../utils/connectMetamask.js';
import { ethers } from 'ethers';
import { ABI } from '../crittersABI.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { initSocket } from '../battle/WebSocketService.js';
import Navbar from '../Navbar.jsx'
import fireGif from '../Assets/fire.gif';
import waterGif from '../Assets/water.gif';
import grassGif from '../Assets/ground.gif'

const BattlePage = () => {
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false); // Track login status

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
  const [clientHeath, setclientHeath] = useState(200);
  const [opponentHealth, setopponentHealth] = useState(200);
  const [roomId, setRoomId] = useState(null); // Change to null initially
  const [matchmakingPage, setMatchmakingPage] = useState(true);
  const [currentTurn, setCurrentTurn] = useState(null); // Use null to indicate waiting state
  const [type, setType] = useState(null); // Use null to indicate waiting state
  const [opponentType, setOpponentType] = useState(null); // Use null to indicate waiting state
  const [gifPath, setGifPath] = useState('');
  const [showGif, setShowGif] = useState(false);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const socketInstance = initSocket();
    setSocket(socketInstance);
  }, []);

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
      console.log({ ...selectedCritterData, ...userData, level: selectedCritterLevel })
      setSendFighterInfoStatus("sending");
    }
  }, [selectedCritterLevel]);

  useEffect(() => {
    if (sendFighterInfoStatus === "sending" && fighterInfo && socket) {
      socket.emit('fighterInfo', fighterInfo);
    }
  }, [sendFighterInfoStatus, fighterInfo, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('updateHealth', ({ health, opponentHealth,attackType }) => {
         // Determine GIF path based on attack type
        let path = '';
        switch (attackType) {
          case 'fire':
            path = fireGif;
            break;
          case 'water':
            path = waterGif;
            break;
          case 'grass':
            path = grassGif;
            break;
          default:
            path = null // Fallback or default GIF
        }
        setGifPath(path);
        setShowGif(true);

        setTimeout(() => setShowGif(false), 1000);
        setclientHeath(health);
        setopponentHealth(opponentHealth);
      });

      socket.on('gameOver', ({ status, reward, winnerUsername, loserUsername }) => {
        if (status === 'won') {
          navigate('/results', {
            state: {
              status: 'won',
              EXP: reward,
              winnerUsername,
              loserUsername
            }
          });
        } else if (status === 'lost') {
          navigate('/results', {
            state: {
              status: 'lost',
              EXP: reward
            }
          });
        }
      });

      socket.on('whoseTurn', ({ turn }) => {
        setCurrentTurn(turn === socket.id ? "mine" : "opponent");
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

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
    setLoggedIn(true); // Mark as logged in
  }

  // Function to fetch all critters
  const fetchData = async () => {
    const fetched = await axios.get("http://localhost:5000/api/v1/critter/fetchCritters", { withCredentials: true });
    setAllCritterData(fetched.data);
  };

  // Function to handle critter selection
  const handleSubmit = (critter) => {
    setSelectedCritterData(critter);
    setCritterAddress(critter.tokenAddress);
  };

  // Function to handle matchmaking
  const matchmaking = (e) => {
    if (fighterInfo) {
      setStartMatch("Matchmaking...");
      socket.once('matchFound', ({ roomId, player, clientDetails, opponent, currentTurn }) => {
        setClientDetails(clientDetails);
        setRoomId(roomId);
        setOpponent(opponent);
        setMatchmakingPage(false);
        setType(clientDetails.type)
        setOpponentType(opponent.type)
        setopponentHealth(opponent.health)
        setCurrentTurn(currentTurn); // Set the initial turn
      });
      setSendFighterInfoStatus(null);
    } else {
      e.preventDefault();
      alert("Select Critter to Match With");
    }
  };

  const handleAttack = () => {
    console.log({ roomId, action: 'attack' })
    socket.emit('action', { roomId, action: 'attack' });
  };

  const handleDefend = () => {
    socket.emit('action', { roomId, action: 'defend' });
  };

  if (!loggedIn) {
    return <div>Login To Play!</div>; // Or redirect to login page
  }

  return (
    <div >
      {matchmakingPage && (
        <>
          <Navbar />
         <h1>Battle Now!</h1> 
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
        </>
      )}

      {/* Battle Interface */}
      {clientDetails && opponent && roomId && (
        <>
        <h2>FIGHT!! Room ID : {roomId}</h2>
        <section className='battleground' >
          <div>
            <div id='opponent'>
              <CritterCard critter={opponent} />
              <h3>Opponent: {opponent.username}</h3>
              <div>
                <h3>Opponent's Health:{opponentHealth}</h3>
              </div>
            </div>
            <div id='us'>
              <h3>Your Info</h3>
              <CritterCard critter={clientDetails} />
            {showGif && <img src={gifPath} alt="Attack Gif" className="gif-animation" />}
              <div>
                <h3>Your Health: {clientHeath}</h3>
                {currentTurn === 'mine' && (
                  <div>
                    <button onClick={handleAttack}>Attack</button>
                    <button onClick={handleDefend}>Defend</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        </>
      )}
    </div>
  );
};

export default BattlePage;
``
