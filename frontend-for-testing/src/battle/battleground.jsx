import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSocket } from './WebSocketService';

const Battleground = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = getSocket(); // Assuming getSocket provides a socket instance
  const [player,setPlayer]=useState(null)

  


  return (
    <div>
      <h1>Battle Page</h1>
      {clientDetails && (
        <div id='us'>
          <h2>Your Info</h2>
          <img src={clientDetails.image} alt="Opponent" />
          <div>
            <h2>Your Health:</h2>
            <p>{player === 1 ? player1Health : player2Health}</p>
          </div>
        </div>
      )}
      {opponent && (
        <div id='opponent'>
          <h2>Opponent: {opponent.username}</h2>
          <img src={opponent.image} alt="Opponent" />
          <div>
            <h2>Your Opponent's Health:</h2>
            <p>{player === 1 ? player2Health : player1Health}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Battleground;
