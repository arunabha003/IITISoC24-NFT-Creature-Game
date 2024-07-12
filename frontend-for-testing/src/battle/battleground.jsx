import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';



const Battleground = () => {
    const { roomId } = useParams(); // Extract the roomId from the URL
    const navigate = useNavigate();
    const [player1Health, setPlayer1Health] = useState(100);
    const [player2Health, setPlayer2Health] = useState(100);
    const [player, setPlayer] = useState(null); // Track whether this client is Player 1 or Player 2
    const [opponent, setOpponent] = useState({});
    const socket = io("http://localhost:5001");
    const [clientDetails, setClientDetails] = useState({});
    const [currentTurn, setCurrentTurn] = useState(null); // Track whose turn it is
    const [turnTimeout, setTurnTimeout] = useState(null); // Timeout for turn

    useEffect(() => {

        socket.on('matchFound', ({ player, clientDetails, opponent }) => {
            setPlayer(player); //1 or 2 ??
            setClientDetails(clientDetails)
            setOpponent(opponent);
            if(player==1){
                setCurrentTurn("mine")
                startTurnTimer()
            }else {
                setCurrentTurn("opponent"); // Set current turn to indicate it's opponent's turn
                startTurnTimer()
            }
        });

        socket.on('updateHealth', ({ player1Health, player2Health }) => {
            setPlayer1Health(player1Health);
            setPlayer2Health(player2Health);
        });

        socket.on('gameOver', ({ winner }) => {
            alert(`Game Over! Player ${winner} wins!`);
            clearTimeout(turnTimeout);
            navigate('/'); // Redirect to home page after game over
        });

        // Cleanup on unmount
        return () => {
            socket.disconnect();
            clearTimeout(turnTimeout);
        };
    }, [roomId, navigate, socket]);

    const handleAction = (action) => {
        // Emit action to the server
        socket.emit('action', { roomId, player, action });
    };

    const switchTurn = () => {
        if(currentTurn=="mine"){
            setCurrentTurn("opponent")
        }
        else{
            setCurrentTurn("mine")
        }
        startTurnTimer();
    };

    // Function to start turn timer
    const startTurnTimer = () => {
        setTurnTimeout(setTimeout(() => {
            switchTurn(); // Automatically switch turn after timeout
        }, 7000)); // 7 seconds timeout
    }

    return (
        <>
            <div>
                <h1>Battleground</h1>
                <div>
                    <h2>Opponent: {opponent.username}</h2>
                    <img src={opponent.image} alt="Opponent" />
                    {player !== 1 && (
                    <div>
                        <h2>You</h2>
                        <p>Health: {player2Health}</p>
                    </div>
                    )}
                    {player !== 2 && (
                    <div>
                        <h2>You</h2>
                        <p>Health: {player2Health}</p>
                    </div>
                    )}
                    <br></br>
                </div>
                {player === 1 && (
                    <div>
                        <h2>You</h2>
                        <p>Health: {player1Health}</p>
                    </div>
                )}
                {player === 2 && (
                    <div>
                        <h2>You</h2>
                        <p>Health: {player2Health}</p>
                    </div>
                )}
                {currentTurn === "mine" ? (
                    <div>
                        <button onClick={() => handleAction('attack')}>Attack</button>
                        <button onClick={() => handleAction('defend')}>Defend</button>
                    </div>
                ) : (
                    <p>Waiting for opponent's move...</p>
                )}
            </div>
        </>
    );
}

export default Battleground;
