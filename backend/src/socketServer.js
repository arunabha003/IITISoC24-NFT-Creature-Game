import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

let playersInLobby = [];
let gameState = {};

//if someone leaves match next one wins

io.on('connection', (socket) => {
    console.log("connected");

    socket.on('fighterInfo', (data) => {
        let playerHealth = { playerHealth: 100 };
        playersInLobby.push({ ...data, socket, ...playerHealth });
        console.log("Player joined:", data.username);

        setTimeout(() => {
            if (playersInLobby.length > 1) {
                const player1 = playersInLobby.shift();
                const player2 = playersInLobby.shift();

                console.log("Matchmaking players:", player1.username, "vs", player2.username);

                const roomId = `Critter-Match-RoomId:${Math.random().toString(36).substr(2, 9)}`;
                console.log("Room ID:", roomId);

                player1.socket.join(roomId);
                player2.socket.join(roomId);

                // Initialize game state
                gameState[roomId] = {
                    player1: { id: player1.socket.id, health: 100, level: player1.level, type: player1.type },
                    player2: { id: player2.socket.id, health: 100, level: player2.level, type: player1.type}
                };

                player1.socket.emit('matchFound', {
                    roomId,
                    player: 1,
                    clientDetails: {
                        username: player1.username,
                        displayName: player1.displayName,
                        image: player1.avatar,
                        level: player1.level
                    },
                    opponent: {
                        username: player2.username,
                        displayName: player2.displayName,
                        image: player2.avatar,
                        level: player2.level
                    }
                });
                
                player2.socket.emit('matchFound', {
                    roomId,
                    player: 2,
                    clientDetails: {
                        username: player2.username,
                        displayName: player2.displayName,
                        image: player2.avatar,
                        level: player2.level
                    },
                    opponent: {
                        username: player1.username,
                        displayName: player1.displayName,
                        image: player1.avatar,
                        level: player1.level
                    }
                });
                

                player1.socket.on('disconnect', () => {
                    console.log(`Player 1 (${player1.username}) disconnected`);
                    playersInLobby = playersInLobby.filter(player => player !== player1);
                });

                player2.socket.on('disconnect', () => {
                    console.log(`Player 2 (${player2.username}) disconnected`);
                    playersInLobby = playersInLobby.filter(player => player !== player2);
                });

            } else {
                socket.emit('notEnoughPlayers', { message: 'Not enough players in queue. Please wait for more players to join.' });
                console.log('Not enough players in queue');
            }
        }, 20000);
    });

    socket.on('action', ({ roomId, player, action }) => {
        if (rooms[roomId].currentTurn === player) {
            // Handle player action based on 'action' parameter
            switch (action) {
                case 'attack':
                    handleAttack(roomId, player);
                    break;
                case 'defend':
                    // Handle defend action if needed
                    break;
                default:
                    // Handle other actions if any
                    break;
            }
            // Emit updated game state to all players in the room
            io.to(roomId).emit('updateHealth', {
                player1Health: rooms[roomId].player1Health,
                player2Health: rooms[roomId].player2Health
            });
            // Check game over condition
            if (checkGameOver(roomId)) {
                const winner = determineWinner(roomId);
                io.to(roomId).emit('gameOver', { winner });
                // Optionally clean up game state after game over
                cleanupRoom(roomId);
            } else {
                // Switch turn after processing action
                switchTurn(roomId);
            }
        } else {
            // Ignore the action if it's not the player's turn
            // Optionally, emit an error event to notify the client
        }
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
        // Clean up any game state or room management related to the disconnected socket
    });

    // Function to handle attack action
    function handleAttack(roomId, player) {
        // Example logic to reduce opponent's health
        const opponent = player === 1 ? 2 : 1;
        rooms[roomId][`player${opponent}Health`] -= 10; // Example: Reduce health by 10
    }

    // Function to switch turn between players
    function switchTurn(roomId) {
        rooms[roomId].currentTurn = rooms[roomId].currentTurn === 1 ? 2 : 1;
        // Emit event to update client about whose turn it is
        io.to(roomId).emit('turnChange', { currentTurn: rooms[roomId].currentTurn });
    }

    // Example function to check game over condition
    function checkGameOver(roomId) {
        return rooms[roomId].player1Health <= 0 || rooms[roomId].player2Health <= 0;
    }

    // Example function to determine the winner
    function determineWinner(roomId) {
        if (rooms[roomId].player1Health <= 0 && rooms[roomId].player2Health <= 0) {
            return 'Draw';
        } else if (rooms[roomId].player1Health <= 0) {
            return 2; // Player 2 wins
        } else {
            return 1; // Player 1 wins
        }
    }

    // Example function to clean up room state after game over
    function cleanupRoom(roomId) {
        delete rooms[roomId]; // Remove the room from rooms object
    }
    
});

httpServer.listen(process.env.SOCKET_IO_PORT, () => {
    console.log("Socket.io server listening on port ", process.env.SOCKET_IO_PORT);
});
