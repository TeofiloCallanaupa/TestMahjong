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

//Create a Deck
function createDeck() {
  let deck = [];
  const suits = ["balls", "sticks", "maahn"];
  const winds = ["east", "south", "west", "north"];
  const dragons = ["red", "green", "white"];
  const flowers = ["a", "b", "c", "d"];
  const numbers = Array.from({ length: 9 }, (_, i) => i + 1);

  // suits
  suits.forEach((suit) => {
    numbers.forEach((number) => {
      for (let i = 0; i < 4; i++) {
        deck.push({ suit, number });
      }
    });
  });

  // winds
  winds.forEach((wind) => {
    for (let i = 0; i < 4; i++) {
      deck.push({ type: "wind", wind });
    }
  });

  // dragons
  dragons.forEach((dragon) => {
    for (let i = 0; i < 4; i++) {
      deck.push({ type: "dragon", dragon });
    }
  });

  // flowers
  flowers.forEach((flower) => {
    for (let i = 0; i < 2; i++) {
      deck.push({ type: "flower", flower });
    }
  });

  return deck;
}

// Shuffle a deck
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Deal Tiles
function dealTiles(deck, numPlayers) {
  let playerHands = {};
  const handSize = 13;

  for (let i = 0; i < numPlayers; i++) {
    playerHands[i] = deck.splice(0, handSize);
  }
  return playerHands;
}

// Initialize deck and shuffle
let deck = createDeck();
shuffleDeck(deck);
let playerHands = dealTiles(deck, 4);

// Draw a card
function drawCard(deck) {
  return deck.pop();
}

io.on("connection", function (socket) {
  console.log("A user connected: " + socket.id);
  players.push(socket.id);
  console.log("Current players: " + players);

  const playerIndex = players.length - 1;
  socket.emit("gameState", { playerHand: playerHands[playerIndex] });

  socket.emit(`isPlayer${String.fromCharCode(65 + playerIndex)}`);

  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.on("decking", (data) => {
    const { room, deck } = data;
    socket.to(room).emit("decking", {
      deck,
      name: `Player${playerIndex + 1}`,
    });
  });

  socket.on("pickingUp", ({ room }) => {
    socket.to(room).emit("pickingUp");
  });

  //when you recieve dealCards, send it to everyone
  socket.on("dealCards", function (playerId) {
    socket.emit("dealCards", { playerId, cards: playerHands[playerId] });
  });

  socket.on("drawCard", function (playerId) {
    const card = drawCard(deck)
    socket.emit("cardDrawn", { playerId, card});
  });

  socket.on("cardPlayed", function (gameObject, playerId) {
    io.emit("cardPlayed", gameObject, playerId);
  });

  socket.on("cardBenched", function (gameObject, playerId) {
    io.emit("cardBenched", gameObject, playerId);
  });

  //who dc and remove player
  socket.on("disconnect", function () {
    console.log("A user disconnected: " + socket.id);
    players = players.filter((player) => player !== socket.id);
    console.log("Current players: " + players);
  });
});

http.listen(1337, function () {
  console.log("Server started!");
});
