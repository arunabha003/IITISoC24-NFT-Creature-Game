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
    console.log("connected",socket.id);
    socket.on('fighterInfo', (data) => {
        playersInLobby.push({ ...data, socket });
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
                    player1Health:100,
                    player2Health:100,
                    currentTurn:1,
                    player1: { id: player1.socket.id, level: player1.level, type: player1.type},
                    player2: { id: player2.socket.id, level: player2.level, type: player1.type}
                };

                //gets current turn
                switchTurn(roomId) //initial turn send to each player 

                io.to(roomId).emit('joinedRoom', "yeah u joined ");

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
                    },
                    currentTurn : gameState[roomId].currentTurn
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
                    },
                    currentTurn : gameState[roomId].currentTurn
                });

                console.log(gameState[roomId])
                // console.log(gameState)

                // setTimeout(() => {
                //     if (gameState[roomId]) {
                //         const winner = determineWinner(roomId);
                //         io.to(roomId).emit('gameOver', { winner });
                //         cleanupRoom(roomId);
                //     }
                // }, 120000);
                

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
        }, 10000);
    });

    socket.on('action', ({ roomId, player, action }) => {
        if (gameState[roomId].currentTurn === player) {
            switch (action) {
                case 'attack':
                    handleAttack(roomId, player);
                    break;
                // case 'defend':
                //     //handle
                //     break;
                case 'none':
                    //none
                    break;
            }  
            io.to(roomId).emit('updateHealth', {
                player1Health: gameState[roomId].player1Health,
                player2Health: gameState[roomId].player2Health
            });

            if (checkGameOver(roomId)) {
                const winner = determineWinner(roomId);
                io.to(roomId).emit('gameOver', {winner});
                cleanupRoom(roomId);
            } else {
                switchTurn(roomId);
                io.to(roomId).emit('whoseTurn',{
                    turn : gameState[roomId].currentTurn
                })
            }
        } else {
            
        }
    });

    

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });

    function handleAttack(roomId, player) {
    
        const opponent = player === 1 ? 2 : 1;
        gameState[roomId][`player${opponent}Health`] -= 10; 

        // if (this.level <= 20) {
        //     return 20 + (this.level - 1) * (20 / 19); // Gradually increase from 20 to 40
        // } else if (this.level <= 40) {
        //     return 60 + (this.level - 21) * (20 / 19); // Gradually increase from 60 to 80
        // } else {
        //     return 100 + (this.level - 41) * (20 / 9); // Gradually increase from 100 to 120
        // }


    }

    
    function switchTurn(roomId) {
        if(gameState[roomId].player1.level>gameState[roomId].player2.level){
            gameState[roomId].currentTurn = 1
        }
        else if(gameState[roomId].player1.level<gameState[roomId].player2.level){
            gameState[roomId].currentTurn = 2
        }
        else{
            gameState[roomId].currentTurn = 1
        }
        
        // io.to(roomId).emit('turnChange', { currentTurn: gameState[roomId].currentTurn });
    }

   
    function checkGameOver(roomId) {
        return gameState[roomId].player1Health <= 0 || gameState[roomId].player2Health <= 0;
    }

    function determineWinner(roomId) {
        if (gameState[roomId].player1Health <= 0 && gameState[roomId].player2Health <= 0) {
            return 'Draw';
        } else if (gameState[roomId].player1Health <= 0) {
            return 2;
        } else {
            return 1; 
        }
    }

    function cleanupRoom(roomId) {
        delete gameState[roomId];
    }
    
});

httpServer.listen(process.env.SOCKET_IO_PORT, () => {
    console.log("Socket.io server listening on port ", process.env.SOCKET_IO_PORT);
});
