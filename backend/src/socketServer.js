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

// Handle socket connections
io.on('connection', (socket) => {
    console.log("connected", socket.id);

    // Handle 'fighterInfo' event and matchmaking logic
    socket.on('fighterInfo', (data) => {
        playersInLobby.push({ ...data, socket });
        console.log("Player joined:", data.username);

        setTimeout(() => {
            if (playersInLobby.length > 1) {
                const player1 = playersInLobby.shift();
                const player2 = playersInLobby.shift();

                // Create unique roomId for the match
                const roomId = `Critter-Match-RoomId:${Math.random().toString(36).substr(2, 9)}`;

                // Initialize game state for the room
                gameState[roomId] = {
                    currentTurn: player1.socket.id,
                    player1instance : player1,
                    player2instance : player2,
                    player1: { id: player1.socket.id, level: player1.level, type: player1.type,health:100 },
                    player2: { id: player2.socket.id, level: player2.level, type: player2.type,health:100 },
                    
                };

                // Emit 'matchFound' event to both players with initial game details
                player1.socket.join(roomId);
                player2.socket.join(roomId);

                player1.socket.emit('matchFound', {
                    roomId,
                    player: 1,
                    clientDetails: {
                        username: player1.username,
                        displayName: player1.displayName,
                        image: player1.avatar,
                        level: player1.level,
                        critterImageUrl: player1.critterImageUrl,
                        nickname: player1.nickname,
                        health:gameState[roomId].player1.health
                    },
                    opponent: {
                        username: player2.username,
                        displayName: player2.displayName,
                        image: player2.avatar,
                        level: player2.level,
                        critterImageUrl: player2.critterImageUrl,
                        nickname: player2.nickname,
                        health:gameState[roomId].player2.health
                    },
                    currentTurn: gameState[roomId].currentTurn
                });

                player2.socket.emit('matchFound', {
                    roomId,
                    player: 2,
                    clientDetails: {
                        username: player2.username,
                        displayName: player2.displayName,
                        image: player2.avatar,
                        level: player2.level,
                        critterImageUrl: player2.critterImageUrl,
                        nickname: player2.nickname,
                        health:gameState[roomId].player2.health
                    },
                    opponent: {
                        username: player1.username,
                        displayName: player1.displayName,
                        image: player1.avatar,
                        level: player1.level,
                        critterImageUrl: player1.critterImageUrl,
                        nickname: player1.nickname,
                        health:gameState[roomId].player1.health
                    },
                    currentTurn: gameState[roomId].currentTurn
                });

                // Emit 'whoseTurn' event to indicate the initial turn
                io.to(roomId).emit('whoseTurn', { turn: gameState[roomId].currentTurn });

                // Handle disconnections and clean up
                player1.socket.on('disconnect', () => {
                    console.log(`Player 1 (${player1.username}) disconnected`);
                    playersInLobby = playersInLobby.filter(player => player !== player1);
                    cleanupRoom(roomId);
                });

                player2.socket.on('disconnect', () => {
                    console.log(`Player 2 (${player2.username}) disconnected`);
                    playersInLobby = playersInLobby.filter(player => player !== player2);
                    cleanupRoom(roomId);
                });

                // Game actions handler
                player1.socket.on('action', ({ action }) => {
                    handleAction(roomId, player1.socket.id, action);
                });

                player2.socket.on('action', ({ action }) => {
                    handleAction(roomId, player2.socket.id, action);
                });

            } else {
                socket.emit('notEnoughPlayers', { message: 'Not enough players in queue. Please wait for more players to join.' });
                console.log('Not enough players in queue');
            }
        }, 10000);
    });

    // Handle disconnection event
    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });

    function handleAction(roomId, playerId, action) {
        let player, opponent;
        let playersocket, opponentsocket;
        if (gameState[roomId].player1.id === playerId) {

            player = gameState[roomId].player1;
            playersocket = gameState[roomId].player1instance.socket;

            opponent = gameState[roomId].player2;
            opponentsocket = gameState[roomId].player2instance.socket;

        } else if (gameState[roomId].player2.id === playerId) {

            player = gameState[roomId].player2;
            playersocket = gameState[roomId].player2instance.socket;

            opponent = gameState[roomId].player1;
            opponentsocket = gameState[roomId].player1instance.socket;

        } else {
            return;
        }

        if (gameState[roomId].currentTurn === player.id) {
            switch (action) {
                case 'attack':
                    console.log(`Player ${player.id} attacked`);
                    handleAttack(roomId, player, opponent);
                    break;
                // Add other actions like defend, etc., as needed

                default:
                    console.log(`Unknown action ${action} from Player ${player.id}`);
                    break;
            }

            // Emit updated health to clients
            playersocket.emit('updateHealth', { health: gameState[roomId].player1.health ,opponentHealth:gameState[roomId].player2.health });
            opponentsocket.emit('updateHealth', { health: gameState[roomId].player2.health ,opponentHealth:gameState[roomId].player1.health });

            // Check if game over
            if (checkGameOver(roomId)) {
                const winner = determineWinner(roomId);
                io.to(roomId).emit('gameOver', { winner });
                cleanupRoom(roomId);
            } else {
                switchTurn(roomId);
                io.to(roomId).emit('whoseTurn', { turn: gameState[roomId].currentTurn });
            }
        }
    }

    function handleAttack(roomId, player, opponent) {
        opponent.health -= 10; // Example: Decrease health by 10 on attack
        
    }

    function switchTurn(roomId) {
        gameState[roomId].currentTurn = gameState[roomId].currentTurn === gameState[roomId].player1.id ? gameState[roomId].player2.id : gameState[roomId].player1.id;
    }

    function checkGameOver(roomId) {
        return gameState[roomId].player1Health <= 0 || gameState[roomId].player2Health <= 0;
    }

    function determineWinner(roomId) {
        if (gameState[roomId].player1Health <= 0 && gameState[roomId].player2Health <= 0) {
            return 'Draw';
        } else if (gameState[roomId].player1Health <= 0) {
            return gameState[roomId].player2.id;
        } else {
            return gameState[roomId].player1.id;
        }
    }

    function cleanupRoom(roomId) {
        delete gameState[roomId];
    }
});

httpServer.listen(process.env.SOCKET_IO_PORT, () => {
    console.log("Socket.io server listening on port ", process.env.SOCKET_IO_PORT);
});
