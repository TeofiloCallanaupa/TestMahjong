// Test Script for Mahjong Logic

const TILE_COUNTS = {
  CORE: 34,
  FLOWERS: 4,
  SEASONS: 4,
  TOTAL_TYPES: 42
};

// Replicating server logic for verification
function getTileType(uid) {
  if (uid < 136) {
    return Math.floor(uid / 4);
  }
  return 34 + (uid - 136);
}

function getTileDerived(uid) {
  const type = getTileType(uid);
  if (type >= 34) {
    const isSeason = type >= 38;
    return {
      type,
      category: 'bonus',
      name: isSeason ? `Season ${type - 37}` : `Flower ${String.fromCharCode(65 + (type - 34))}`,
      isBonus: true
    };
  }
  return { type, category: 'suit/honor', isBonus: false };
}

function runTest() {
  console.log("--- Starting Deck Verification ---");
  
  const deck = Array.from({ length: 144 }, (_, i) => i);
  
  // 1. Verify Deck Size
  if (deck.length !== 144) {
    console.error(`FAIL: Deck size is ${deck.length}, expected 144`);
    return;
  }
  console.log("PASS: Deck size is 144");

  // 2. Verify Tile Types
  const typeCounts = {};
  deck.forEach(uid => {
    const type = getTileType(uid);
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  // Verify Core Tiles (0-33) have 4 copies
  for (let i = 0; i <= 33; i++) {
    if (typeCounts[i] !== 4) {
      console.error(`FAIL: Tile Type ${i} has ${typeCounts[i]} copies, expected 4`);
      return;
    }
  }
  console.log("PASS: Core tiles (0-33) all have 4 copies");

  // Verify Bonus Tiles (34-41) have 1 copy
  for (let i = 34; i <= 41; i++) {
    if (typeCounts[i] !== 1) {
      console.error(`FAIL: Bonus Type ${i} has ${typeCounts[i]} copies, expected 1`);
      return;
    }
  }
  console.log("PASS: Bonus tiles (34-41) all have 1 copy");

  // 3. Verify Derived Logic
  const sampleSeason = getTileDerived(140); 
  if (sampleSeason.name !== 'Season 1' || !sampleSeason.isBonus) {
     console.error(`FAIL: UID 140 should be Season 1`, sampleSeason);
  } else {
    console.log("PASS: Logic check for Season 1 (UID 140)");
  }

  const sampleFlower = getTileDerived(136); 
  if (sampleFlower.name !== 'Flower A' || !sampleFlower.isBonus) {
     console.error(`FAIL: UID 136 should be Flower A`, sampleFlower);
  } else {
    console.log("PASS: Logic check for Flower A (UID 136)");
  }

  console.log("--- Verification Complete ---");
}

runTest();
