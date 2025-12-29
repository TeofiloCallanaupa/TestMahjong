const io = require("socket.io-client");

const SERVER_URL = "http://localhost:1337";
const NUM_PLAYERS = 4;

console.log(`--- Starting 4-Player Simulation ---`);

const clients = [];

for (let i = 0; i < NUM_PLAYERS; i++) {
  const client = io(SERVER_URL);
  clients.push(client);

  client.on("connect", () => {
    // console.log(`[Client ${i}] Connected with ID: ${client.id}`);
  });

  client.on("gameStatePublic", (data) => {
    if (data.mySeat !== undefined) {
      console.log(`[Client ${i}] Assigned Seat: ${data.mySeat}`);
    }
  });

  client.on("handStatePrivate", (data) => {
    console.log(`[Client ${i}] Received Hand: ${data.hand.length} tiles. Bonus count: ${data.bonuses.length}`);
    // console.log(`[Client ${i}] Hand UIDs: ${data.hand}`);
    
    // Verify uniqueness (simple check: first tile of each hand shouldn't be identical ideally, but better to check server logs for full uniqueness)
  });

  client.on("error", (err) => {
    console.error(`[Client ${i}] Error:`, err);
  });
}

// Keep alive for a moment then exit
setTimeout(() => {
  console.log("--- Simulation Complete ---");
  process.exit(0);
}, 3000);
