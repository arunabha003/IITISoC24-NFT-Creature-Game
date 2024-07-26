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
                    player1: { id: player1.socket.id, username : player1.username,level: player1.level, type: player1.type,health:200, baseDefense: 0,NOD: 0,attack: 0},
                    player2: { id: player2.socket.id,username : player2.username, level: player2.level, type: player2.type,health:200, baseDefense: 0,NOD: 0,attack: 0 },
                    
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

                
                initializePlayer(roomId,1) //initialize player 1
                initializePlayer(roomId,2) //initialize player 2

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
                //yeh player 1 and player 2 kaun h ??
                // Game actions handler  //yeh bahar likhe k test krna  g 
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
        let player, opponent ,numberNOD;
        let playersocket, opponentsocket;
        if (gameState[roomId].player1.id === playerId) {

            player = gameState[roomId].player1;
            numberNOD = 1
            playersocket = gameState[roomId].player1instance.socket;

            opponent = gameState[roomId].player2;
            opponentsocket = gameState[roomId].player2instance.socket;

        } else if (gameState[roomId].player2.id === playerId) {

            player = gameState[roomId].player2;
            numberNOD = 2
            playersocket = gameState[roomId].player2instance.socket;

            opponent = gameState[roomId].player1;
            opponentsocket = gameState[roomId].player1instance.socket;

        } else {
            return;
        }

        if (gameState[roomId].currentTurn === player.id) {
            switch (action) {
                case 'attack':
                    // console.log(`Player ${player.id} attacked`);
                    handleAttack(roomId, player, opponent);
                    if (gameState[roomId][`player${numberNOD}`].NOD == 5 && gameState[roomId][`player${numberNOD}`].NOD>0) {
                      gameState[roomId][`player${numberNOD}`].NOD =gameState[roomId][`player${numberNOD}`].NOD - 1  
                    }
                    break;
                case 'defend':
                    // console.log(`Player ${player.id} chose defense`);
                    incrementDefenseCount(roomId,numberNOD)
                    break;
                // Add other actions like defend, etc., as needed

                default:
                    console.log(`Unknown action ${action} from Player ${player.id}`);
                    break;
            }

            
            // Emit updated health to clients
            playersocket.emit('updateHealth', { health: player.health ,opponentHealth:opponent.health });
            opponentsocket.emit('updateHealth', { health: opponent.health ,opponentHealth:player.health });

            // Check if game over
            if (checkGameOver(roomId,player,opponent)) {
                // const winner = determineWinner(roomId,player,opponent);
                const winnerXP = 50 + (opponent.level*10) 
                const defeatedXP = 50 * 0.1
                try {
                  playersocket.emit('gameOver',{status : "won",reward:winnerXP, winnerUsername : player.username, loserUsername: opponent.username})
                  opponentsocket.emit('gameOver',{status : "lost",reward:defeatedXP})
                } catch (error) {
                  console.log("error in transfering data after match over")
                }
                cleanupRoom(roomId);
            } else {
                switchTurn(roomId);
                // console.log(gameState[roomId])
                io.to(roomId).emit('whoseTurn', { turn: gameState[roomId].currentTurn });
            }
        }
    }

    function initializePlayer(roomId,number) {
      gameState[roomId][`player${number}`].attack = calculateAttackDamage(gameState[roomId][`player${number}`].level);
      gameState[roomId][`player${number}`].baseDefense = calculateBaseDefense(gameState[roomId][`player${number}`].level);
  }

    function handleAttack(roomId, player, opponent) {
        // opponent.health -= 10; // Example: Decrease health by 10 on attack
        //turn automatic change
        calculateOpponentHeath(player, opponent) 
    }

    function calculateOpponentHeath(player, opponent) {
        if (getOpponentDefense(opponent,player) >= getPlayerAttack(player,opponent)) {
          opponent.health = opponent.health - Math.ceil(0.2 * getPlayerAttack(player,opponent));
        }
        opponent.health = opponent.health - getPlayerAttack(player,opponent) + getOpponentDefense(opponent,player)
    }
    
    function getOpponentDefense(opponent,player) {
        return Math.ceil(
          opponent.baseDefense * (1 + opponent.NOD) * DefenseAdvantageofOpponent(opponent,player)
        );
    }

      function DefenseAdvantageofOpponent(opponent,player) {
        if (
          (opponent.type === "water" && player.type === "fire") ||
          (opponent.type === "fire" && player.type === "grass") ||
          (opponent.type === "grass" && player.type === "water")
        ) {
          return 1.15; // 15% more defence
        }
        return 1.0; // Normal damage taken
      }

      function getPlayerAttack(player,opponent) {
        return Math.ceil(
          player.attack * (0.8 + (Math.random() * 0.4)) * attackAdvantageOfPlayer(player,opponent)
        ); // Random value between 0.8 and 1.2 times attack
      }
    

    function calculateAttackDamage(level) {
        if (level >= 1 && level <= 20) {
          return 20 + (level - 1); // Levels 1-20: Damage increases by 1 for each level
        } else if (level > 20 && level <= 40) {
          return 60 + (level - 21); // Levels 21-40: Damage increases by 1 for each level
        } else if (level > 40 && level <= 50) {
          return 100 + (level - 41); // Levels 41-50: Damage increases by 1 for each level
        } else {
          return 0; // Default case if level is out of expected range
        }
      }
      function calculateBaseDefense(level) {
        if (level >= 1 && level <= 20) {
          return 5 + (level - 1); // Levels 1-20: Base defense increases by 1 for each level
        } else if (level > 20 && level <= 40) {
          return 25 + (level - 21); // Levels 21-40: Base defense increases by 1 for each level
        } else if (level > 40 && level <= 50) {
          return 45 + (level - 41); // Levels 41-50: Base defense increases by 1 for each level
        } else {
          return 0; // Default case if level is out of expected range
        }
      }
    
      function attackAdvantageOfPlayer(player,opponent) {
        {
          if (
            (opponent.type === "fire" && player.type === "water") ||
            (opponent.type === "grass" && player.type === "fire") ||
            (opponent.type === "water" && player.type === "grass")
          ) {
            return 1.2; // 20% more damage by the opponent
          }
          return 1.0; // Normal damage
        }
    }

    function switchTurn(roomId) {
        gameState[roomId].currentTurn = gameState[roomId].currentTurn === gameState[roomId].player1.id ? gameState[roomId].player2.id : gameState[roomId].player1.id;
    }

    function checkGameOver(roomId,player,opponent) {
      if(player.health<=0){
        return true
      }else if(opponent.health<=0){
        return true
      }
    }

    // function determineWinner(roomId,player,opponent) {
    //   if(player.health<=0){
    //     return "opponent"
    //   }else if(opponent.health<=0){
    //     return "player"
    //   }
    // }

    function incrementDefenseCount(roomId,numberNOD) {
      if (gameState[roomId][`player${numberNOD}`].NOD < 5) {
        gameState[roomId][`player${numberNOD}`].NOD =  gameState[roomId][`player${numberNOD}`].NOD +1
      }
    }
    function cleanupRoom(roomId) {
        delete gameState[roomId];
    }
});

httpServer.listen(process.env.SOCKET_IO_PORT, () => {
    console.log("Socket.io server listening on port ", process.env.SOCKET_IO_PORT);
});
