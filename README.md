# Mahjong Engine

A custom Mahjong game engine built from scratch to explore game logic, deck management, and real-time multiplayer interactions.

## Project Structure

- **/server.js**: The core game server handling deck management, player hands, and socket events.
- **/allTiles.js**: Tile definitions and helper data.
- **/client**: The frontend game application built with Phaser 3.

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation
1. Install root dependencies: `npm install`
2. Install client dependencies: `cd client && npm install`

### Running the Project
1. Start the game server (root folder): `npm start`
2. Start the client development server (client folder): `cd client && npm start`

## Core Logic
The engine currently supports:
- Full deck generation (Suits, Winds, Dragons, Flowers).
- Fisher-Yates shuffle algorithm.
- Dealing logic for 13-tile hands.
- Real-time communication via Socket.io.
