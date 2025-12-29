const express = require("express");
const app = express();
const http = require("http").createServer(app);
//screw cors
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

let players = [];

// --- Constants & Helpers ---
const TILE_COUNTS = {
  CORE: 34,    // 0-33: Balls(9), Sticks(9), Maahn(9), Winds(4), Dragons(3)
  FLOWERS: 4,  // 34-37
  SEASONS: 4,  // 38-41
  TOTAL_TYPES: 42
};
const COPIES_PER_CORE = 4;
const TOTAL_TILES = 144;
const ROOM_CODE = "MJ-" + Math.floor(1000 + Math.random() * 9000);

// Type Ranges
const TYPE = {
  BALLS_START: 0,
  STICKS_START: 9,
  MAAHN_START: 18,
  WINDS_START: 27,
  DRAGONS_START: 31,
  FLOWERS_START: 34,
  SEASONS_START: 38
};

/**
 * Returns the Tile Type (0-41) for a given physical ID (0-143).
 */
function getTileType(uid) {
  if (uid < 136) {
    return Math.floor(uid / 4);
  }
  return 34 + (uid - 136);
}

/**
 * Returns human-readable debug info and logic constants.
 */
function getTileDerived(uid) {
  const type = getTileType(uid);
  
  // Bonus check
  if (type >= TYPE.FLOWERS_START) {
    const isSeason = type >= TYPE.SEASONS_START;
    return {
      type,
      category: 'bonus',
      name: isSeason ? `Season ${type - 37}` : `Flower ${String.fromCharCode(65 + (type - 34))}`,
      isBonus: true
    };
  }

  // Core tiles
  if (type >= TYPE.DRAGONS_START) return { type, category: 'honor', suit: 'dragon', value: type - 31 };
  if (type >= TYPE.WINDS_START) return { type, category: 'honor', suit: 'wind', value: type - 27 };
  if (type >= TYPE.MAAHN_START) return { type, category: 'suit', suit: 'maahn', value: (type - 18) + 1 };
  if (type >= TYPE.STICKS_START) return { type, category: 'suit', suit: 'sticks', value: (type - 9) + 1 };
  return { type, category: 'suit', suit: 'balls', value: type + 1 };
}

function isBonus(uid) {
  return uid >= 136;
}

// --- Game State ---
function createDeck() {
  // simply an array of integers 0 to 143
  const deck = Array.from({ length: TOTAL_TILES }, (_, i) => i);
  return deck;
}

// Fisher-Yates Shuffle
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// --- Logic ---
let deck = [];
let playerHands = {};
let bonuses = { 0: [], 1: [], 2: [], 3: [] }; // Bonus tiles per player
let discards = [];

function resetGame() {
  deck = createDeck();
  shuffleDeck(deck);
  playerHands = { 0: [], 1: [], 2: [], 3: [] };
  bonuses = { 0: [], 1: [], 2: [], 3: [] };
  discards = [];
  
  // Deal 13 tiles to each
  for (let p = 0; p < 4; p++) {
    while (playerHands[p].length < 13) {
      if (deck.length === 0) break;
      drawTileForPlayer(p);
    }
  }
}

/**
 * Draws a tile for a player. 
 * specific logic: If bonus, store it and draw again immediately.
 */
function drawTileForPlayer(playerIndex) {
  if (deck.length === 0) return null;
  
  const tile = deck.pop();
  
  if (isBonus(tile)) {
    // It's a bonus! Add to bonus array and recurse
    bonuses[playerIndex].push(tile);
    // console.log(`Player ${playerIndex} drew bonus ${tile} (${getTileDerived(tile).name}). Drawing again...`);
    return drawTileForPlayer(playerIndex);
  }
  
  playerHands[playerIndex].push(tile);
  return tile;
}

resetGame();

// Map socket.id -> Seat Index (0-3)
const socketToSeat = {};

io.on("connection", function (socket) {
  console.log("A user connected: " + socket.id);

  // Assign a seat if available (Free-for-all for now)
  let mySeat = -1;
  for (let i = 0; i < 4; i++) {
    // Basic check: if no socket maps to this seat, take it.
    // (In a real app, we'd handle reconnections more robustly)
    if (!Object.values(socketToSeat).includes(i)) {
      mySeat = i;
      socketToSeat[socket.id] = i;
      break;
    }
  }

  if (mySeat === -1) {
    socket.emit("error", { message: "Game is full" });
    return;
  }

  console.log(`User ${socket.id} assigned to Seat ${mySeat}`);

  // 1. Send Public Game State
  socket.emit("gameStatePublic", {
    roomCode: ROOM_CODE,
    deckCount: deck.length,
    discards: discards,
    turnSeat: 0, // Hardcoded for now
    handSizes: {
      0: playerHands[0].length,
      1: playerHands[1].length,
      2: playerHands[2].length,
      3: playerHands[3].length
    },
    mySeat: mySeat
  });

  // 2. Send Private Hand State
  socket.emit("handStatePrivate", {
    hand: playerHands[mySeat],
    bonuses: bonuses[mySeat]
  });

  // --- Actions ---

  socket.on("drawCard", () => {
    // Validate turn (ToDo)
    const newTile = drawTileForPlayer(mySeat);
    
    if (newTile !== null) {
      // Update this player privately
      socket.emit("handStatePrivate", {
        hand: playerHands[mySeat],
        bonuses: bonuses[mySeat]
      });

      // Notify everyone else of state change
      io.emit("gameStatePublic", {
        roomCode: ROOM_CODE,
        deckCount: deck.length,
        discards: discards,
        turnSeat: 0, 
        handSizes: {
          0: playerHands[0].length,
          1: playerHands[1].length,
          2: playerHands[2].length,
          3: playerHands[3].length
        },
        // We don't send mySeat here, just general data
      });
    }
  });

  socket.on("cardPlayed", (tileUid) => {
    // Remove from hand
    const hand = playerHands[mySeat];
    const index = hand.indexOf(tileUid);
    
    if (index > -1) {
      hand.splice(index, 1);
      discards.push(tileUid);

      // Update private hand
      socket.emit("handStatePrivate", {
        hand: hand,
        bonuses: bonuses[mySeat]
      });

      // Broadcast discard to all
      io.emit("gameStatePublic", {
        roomCode: ROOM_CODE,
        deckCount: deck.length,
        discards: discards,
        lastDiscard: { seat: mySeat, tileUid: tileUid },
        handSizes: {
          0: playerHands[0].length,
          1: playerHands[1].length,
          2: playerHands[2].length,
          3: playerHands[3].length
        }
      });
    }
  });

  socket.on("disconnect", function () {
    console.log(`Seat ${mySeat} (${socket.id}) disconnected`);
    delete socketToSeat[socket.id];
  });
});

http.listen(1337, function () {
  console.log("Server started on port 1337");
  resetGame(); // Ensure fresh game on start
});
