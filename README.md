# IITISoC24-NFT-Creature-Game

## Overview

This project implements a multiplayer battle system using Node.js, Socket.IO, and a React frontend. The game involves real-time player interactions, matchmaking, and battle mechanics. The system is deployed on the Holesky test network and includes features for player matchmaking, turn-based battles, and dynamic NFT management.

## Features

### Backend

- **Player Matchmaking**: Players are matched into pairs for battle.
- **Battle Mechanics**: Players can perform actions such as attacking and defending.
- **Turn Management**: Alternates turns between players with real-time updates.
- **Health Management**: Health updates based on actions and defenses.
- **Victory and Loss Conditions**: Determines winners and losers based on health.
- **Type Advantages**: Fighters have type-based advantages (Fire, Water, Grass).
- **Defensive NOD Mechanic**: Defensive effectiveness increases with repeated use of the defend action.

### Frontend

- **Vite + React**: Utilized for a modern and fast frontend experience.
- **Real-Time Updates**: Managed through Socket.IO for responsive gameplay.

### Blockchain

- **ERC721 Tokens**: NFTs representing creatures with features for minting, upgrading, and trading.
- **Minting and Claiming**: Users can mint or claim NFTs through the `claimNFTs` contract.
- **Upgrading and Evolution**: NFTs can be upgraded and evolved to higher levels.
- **Listing and Trading**: NFTs can be listed for sale, purchased, and traded on the marketplace.

## How It Works

1. **Player Connection and Matchmaking**:
   - Players connect to the server and provide their fighter information.
   - Players are matched with an opponent when two players are available.
   - A unique room ID is generated for each match.

2. **Game Initialization**:
   - The game state is initialized with player details, including health, defense, and attack attributes.
   - Players are informed of their opponent's details and the current turn.

3. **Action Handling**:
   - Players perform actions such as 'attack' or 'defend'.
   - Actions are processed based on the player's turn, and the game state is updated.
   - Health is recalculated based on actions.

4. **Turn Management**:
   - Turns alternate between players.
   - Events are emitted to indicate whose turn it is and to update player health.

5. **Game End**:
   - Victory or defeat conditions are checked.
   - The game ends when a player’s health drops to zero or below.

6. **Type Advantages**:
   - **Fire** > **Grass** (Attack & Defense)
   - **Water** > **Fire** (Attack & Defense)
   - **Grass** > **Water** (Attack & Defense)
   - Type advantages affect damage and defense calculations.

7. **Defensive NOD Mechanic**:
   - **NOD** (Number of Defenses) represents how many times a player has used the defend action.
   - Defense value increases with repeated use up to a specific limit.

8. **Room Cleanup**:
   - Game state is cleaned up after the game ends or if a player disconnects.

## Frontend

- **Vite + React**: Provides a fast and interactive user interface.
- **Socket.IO**: Enables real-time communication between the client and server.

## Server

- **Express**: Manages the backend server and handles routing.

## Blockchain Deployment

- **Holesky Test Network**: Deployed smart contracts and game logic on the Holesky test network.

## Off-Chain Elements

- **User Data**: User profiles and data are managed separately from the blockchain.
- **Critters Storage**: Critter data and stats are stored off-chain.
- **Transaction Records**: Local records of transactions and trades are maintained.
- **Marketplace Trading**: Critters can be traded through the integrated marketplace.

## Setup Instructions

### Backend

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the server with `npm start`.

### Frontend

1. Navigate to the frontend directory.
2. Install dependencies with `npm install`.
3. Start the development server with `npm run dev`.

### Blockchain

1. Deploy contracts to the Holesky test network.
2. Update contract addresses in the backend configuration.

## Contributing

Feel free to submit issues, feature requests, and pull requests. Ensure you follow the contribution guidelines provided in the repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
