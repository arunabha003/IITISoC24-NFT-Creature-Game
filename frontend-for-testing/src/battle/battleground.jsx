import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const Battleground = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [player1Health, setPlayer1Health] = useState(100);
  const [player2Health, setPlayer2Health] = useState(100);
  const [player, setPlayer] = useState(null);
  const [opponent, setOpponent] = useState({});
  const [DATA, setDATA] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5001", {
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.emit('joinRoom', { roomId });

    newSocket.on("joinedRoom", (data) => {
      console.log("data:", data);
      setDATA(data);
    });

    newSocket.on('matchFound', ({ player, clientDetails, opponent, currentTurn }) => {
      setPlayer(player);
      setClientDetails(clientDetails);
      setOpponent(opponent);
      if (player === currentTurn) {
        setCurrentTurn("mine");
        startTurnTimer();
      } else {
        setCurrentTurn("opponent");
        startTurnTimer();
      }
    });

    newSocket.on('updateHealth', ({ player1Health, player2Health }) => {
      setPlayer1Health(player1Health);
      setPlayer2Health(player2Health);
    });

    newSocket.on('whoseTurn', ({ turn }) => {
      if (player === turn) {
        setCurrentTurn("mine");
      } else {
        setCurrentTurn("opponent");
      }
    });

    newSocket.on('gameOver', ({ winner }) => {
      clearTimeout(turnTimeout);
      navigate('/results', { state: { results: { result: winner === player ? 'won' : 'lost', reward: null } } });
    });

    return () => {
      newSocket.disconnect();
      clearTimeout(turnTimeout);
    };
  }, [roomId, navigate]);

  const handleAction = (action) => {
    socket.emit('action', { roomId, player, action });
  };

  const startTurnTimer = () => {
    setTurnTimeout(setTimeout(() => {
      socket.emit('action', { roomId, player, action: 'none' });
    }, 10000));
  };

  return (
    <>
      <div>
        <h1>{DATA}</h1>
        <h1>Battleground</h1>
        <div id='opponent'>
          <h2>Opponent: {opponent.username}</h2>
          <img src={opponent.image} alt="Opponent" />
          <div>
            <h2>Your Opponent's Health:</h2>
            <p>{player === 1 ? player2Health : player1Health}</p>
          </div>
        </div>

        <div id='us'>
          <h2>Your Info</h2>
          <img src={clientDetails.image} alt="Opponent" />
          <div>
            <h2>Your Health:</h2>
            <p>{player === 1 ? player1Health : player2Health}</p>
          </div>

          {currentTurn === "mine" ? (
            <div>
              <button onClick={() => handleAction('attack')}>Attack</button>
            </div>
          ) : (
            <p>Waiting for opponent's move... 10 seconds</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Battleground;
