class AllTiles {
  constructor(scene) {
    // 4 player hands
    let playerASprite = [];
    let playerBSprite = [];
    let playerCSprite = [];
    let playerDSprite = [];
    let playerSprite;
    let opponentSprite;
    let deck = Phaser.Utils.Array.NumberArray(0, 143);
    // Phaser.Utils.Array.Shuffle(deck)
    //check the player and render the correct cards

    //all tiles in board
    let dragonRed = "dragonRed";
    let dragonGreen = "dragonGreen";
    let dragonWhite = "dragonWhite";
    let balls1 = "balls1";
    let balls2 = "balls2";
    let balls3 = "balls3";
    let balls4 = "balls4";
    let balls5 = "balls5";
    let balls6 = "balls6";
    let balls7 = "balls7";
    let balls8 = "balls8";
    let balls9 = "balls9";
    let sticksChicken = "sticksChicken";
    let sticks2 = "sticks2";
    let sticks3 = "sticks3";
    let sticks4 = "sticks4";
    let sticks5 = "sticks5";
    let sticks6 = "sticks6";
    let sticks7 = "sticks7";
    let sticks8 = "sticks8";
    let sticks9 = "sticks9";
    let maahn1 = "maahn1";
    let maahn2 = "maahn2";
    let maahn3 = "maahn3";
    let maahn4 = "maahn4";
    let maahn5 = "maahn5";
    let maahn6 = "maahn6";
    let maahn7 = "maahn7";
    let maahn8 = "maahn8";
    let maahn9 = "maahn9";
    let windEast = "windEast";
    let windSouth = "windSouth";
    let windWest = "windWest";
    let windNorth = "windNorth";
    let flowerA1 = "flowerA1";
    let flowerA2 = "flowerA2";
    let flowerA3 = "flowerA3";
    let flowerA4 = "flowerA4";
    let flowerB1 = "flowerB1";
    let flowerB2 = "flowerB2";
    let flowerB3 = "flowerB3";
    let flowerB4 = "flowerB4";

    //set up a deck with one copy of each tile
    let tiles = [
      dragonRed,
      dragonGreen,
      dragonWhite,
      balls1,
      balls2,
      balls3,
      balls4,
      balls5,
      balls6,
      balls7,
      balls8,
      balls9,
      sticksChicken,
      sticks2,
      sticks3,
      sticks4,
      sticks5,
      sticks6,
      sticks7,
      sticks8,
      sticks9,
      maahn1,
      maahn2,
      maahn3,
      maahn4,
      maahn5,
      maahn6,
      maahn7,
      maahn8,
      maahn9,
      windEast,
      windSouth,
      windWest,
      windNorth,
    ];
    // set up a deck with one copy of each flower tile
    let flowers = [
      flowerA1,
      flowerA2,
      flowerA3,
      flowerA4,
      flowerB1,
      flowerB2,
      flowerB3,
      flowerB4,
    ];
    // let repeating = 4;
    // let mostTiles = Array.from({ repeating }, (i) => tiles).flat();
    for (let i = 0; i < 2; i++) {
      tiles = tiles.concat(tiles).flat();
    }

    // add the flowers
    let allTiles = tiles.concat(flowers).flat();

    // shuffle
    Phaser.Utils.Array.Shuffle(allTiles);

    console.log(allTiles);

    //layout all the hands first 13 tiles per hand
    for (let j = 0; j < 52; j++) {
      if (j < 13) {
        const tempA = allTiles.shift();
        playerASprite.push(tempA);
      } else if (j >= 13 && j < 26) {
        const tempB = allTiles.shift();
        playerBSprite.push(tempB);
      } else if (j >= 26 && j < 39) {
        const tempC = allTiles.shift();
        playerCSprite.push(tempC);
      } else if (j >= 39 && j < 52) {
        const tempD = allTiles.shift();
        playerDSprite.push(tempD);
      }
    }

    console.log("player1", playerASprite);
    console.log("player2", playerBSprite);
    console.log("player3", playerCSprite);
    console.log("player4", playerDSprite);
    this.dealCards = () => {
      if (scene.isPlayerA) {
        playerSprite = [...playerASprite];
        console.log("meA", playerSprite);
        // allTiles.splice(0, 13);
        opponentSprite = "tileBack";
      }
      // if(scene.isPlayerB) {
      else {
        playerSprite = [...playerBSprite];
        console.log(playerSprite);
        // allTiles.splice(0, 13);
        opponentSprite = "tileBack";
      }

      //new dealcards func
      for (let i = 0; i < 13; i++) {
        let playerCard = new Card(scene);
        playerCard.render(400 + i * 50, 650, playerSprite[i]);
        // allTiles.splice(i,1)
        // i--;
        let opponentCard = new Card(scene);
        scene.opponentCards.push(
          opponentCard
            .render(400 + i * 50, 125, opponentSprite)
            .disableInteractive()
        );
      }
      console.log("after", allTiles);
    };
  }
}
