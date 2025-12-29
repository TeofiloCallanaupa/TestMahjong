import Card from "../helpers/card";
import Zone from "../helpers/zone";
import MyZone from "../helpers/myZone";
import Dealer from "../helpers/dealer";
import Draw from "../helpers/draw";
import io from "socket.io-client";
import TileMapper from "../helpers/allTiles";

export default class Game extends Phaser.Scene {
  constructor() {
    super({
      //when phaser accesses this class, the key for this class is game
      key: "Game",
    });
  }
  preload() {
    //preloads all the assets you need for the game to work
    this.load.image("greenDragon", "src/assets/GreenDragon.png");
    this.load.image("redDragon", "src/assets/RedDragon.png");
    this.load.image("whiteDragon", "src/assets/WhiteDragon.png");
    this.load.image("tileBack", "src/assets/TileBack.png");
    this.load.image("balls1", "src/assets/Balls1.png");
    this.load.image("balls2", "src/assets/Balls2.png");
    this.load.image("balls3", "src/assets/Balls3.png");
    this.load.image("balls4", "src/assets/Balls4.png");
    this.load.image("balls5", "src/assets/Balls5.png");
    this.load.image("balls6", "src/assets/Balls6.png");
    this.load.image("balls7", "src/assets/Balls7.png");
    this.load.image("balls8", "src/assets/Balls8.png");
    this.load.image("balls9", "src/assets/Balls9.png");
    this.load.image("sticksChicken", "src/assets/SticksChicken.png");
    this.load.image("sticks2", "src/assets/Sticks2.png");
    this.load.image("sticks3", "src/assets/Sticks3.png");
    this.load.image("sticks4", "src/assets/Sticks4.png");
    this.load.image("sticks5", "src/assets/Sticks5.png");
    this.load.image("sticks6", "src/assets/Sticks6.png");
    this.load.image("sticks7", "src/assets/Sticks7.png");
    this.load.image("sticks8", "src/assets/Sticks8.png");
    this.load.image("sticks9", "src/assets/Sticks9.png");
    this.load.image("maahn1", "src/assets/Maahn1.png");
    this.load.image("maahn2", "src/assets/Maahn2.png");
    this.load.image("maahn3", "src/assets/Maahn3.png");
    this.load.image("maahn4", "src/assets/Maahn4.png");
    this.load.image("maahn5", "src/assets/Maahn5.png");
    this.load.image("maahn6", "src/assets/Maahn6.png");
    this.load.image("maahn7", "src/assets/Maahn7.png");
    this.load.image("maahn8", "src/assets/Maahn8.png");
    this.load.image("maahn9", "src/assets/Maahn9.png");
    this.load.image("windEast", "src/assets/WindEast.png");
    this.load.image("windSouth", "src/assets/WindSouth.png");
    this.load.image("windWest", "src/assets/WindWest.png");
    this.load.image("windNorth", "src/assets/WindNorth.png");
    this.load.image("flowerA", "src/assets/FlowerA.png");
    this.load.image("flowerB", "src/assets/FlowerB.png");
    this.load.image("flowerC", "src/assets/FlowerC.png");
    this.load.image("flowerD", "src/assets/FlowerD.png");
    this.load.image("season1", "src/assets/Season1.png");
    this.load.image("season2", "src/assets/Season2.png");
    this.load.image("season3", "src/assets/Season3.png");
    this.load.image("season4", "src/assets/Season4.png");
    this.load.image("dragonGreen", "src/assets/DragonGreen.png");
    this.load.image("dragonRed", "src/assets/DragonRed.png");
    this.load.image("dragonWhite", "src/assets/DragonWhite.png");
    // this.load.spritesheet('tiles', 'src/assets/mahjongsheet.jpg',
    // {
    //     frameWidth: 82,
    //     frameHeight: 107
    // })
    // this.load.atlas('tiles', 'assets/EveryMahjongTile.jpg', 'assets/EveryMahjongTile.json')
  }

  create() {
    //calls everything you need to create the game
    //attempt at making more individual players
    let self = this;
    this.players = {};
    
    // Core game objects
    this.myHandGroup = this.add.group();
    this.opponentHandGroup = this.add.group(); // Placeholder for visual count
    this.discardsGroup = this.add.group();
    
    // Zones
    this.zone = new Zone(this);
    this.dropZone = this.zone.renderZone();
    this.outline = this.zone.renderOutline(this.dropZone);
    this.myZone = new MyZone(this);
    this.myDropZone = this.myZone.renderMyZone();
    
    // Legacy helper instantiation (might need refactor later)
    this.dealer = new Dealer(this); 
    
    // UI Text
    this.dealText = this.add.text(50, 50, ['Waiting for players...']).setFontSize(18).setColor('#00FFFF');
    this.seatText = this.add.text(50, 75, ['Player: ?']).setFontSize(18).setColor('#00AAFF');
    this.roomText = this.add.text(50, 100, ['Room: Waiting...']).setFontSize(18).setColor('#00FF00');
    
    this.socket = io("http://localhost:1337");

    this.socket.on("connect", function () {
      console.log("Connected to server!");
    });

    // --- New Server Events ---

    this.socket.on("gameStatePublic", (state) => {
      // Updates deck count, discards, etc.
      self.dealText.setText(`Deck: ${state.deckCount} | Turn: Seat ${state.turnSeat}`);
      self.roomText.setText(`Room: ${state.roomCode}`);
      
      // Update persistent seat info if provided (initial connection)
      if (state.mySeat !== undefined) {
         self.seatText.setText(`Player Seat: ${state.mySeat}`);
      }
      
      // Render Discards
      self.discardsGroup.clear(true, true);
      state.discards.forEach((uid, index) => {
        let spriteKey = TileMapper.getSpriteKey(uid);
        let x = self.dropZone.x - 300 + (index % 15) * 40;
        let y = self.dropZone.y - 100 + Math.floor(index / 15) * 50;
        let card = self.add.image(x, y, spriteKey).setScale(0.8);
        self.discardsGroup.add(card);
      });
    });

    this.socket.on("handStatePrivate", (data) => {
      // Render MY hand (private)
      self.myHandGroup.clear(true, true);
      
      data.hand.sort((a,b) => a - b); // Basic sort by ID for now
      
      data.hand.forEach((uid, index) => {
        let spriteKey = TileMapper.getSpriteKey(uid);
        // let card = new Card(self); // Use helper if compatible, else raw image
        // card.render(100 + index * 60, 650, spriteKey);
        
        let card = self.add.image(150 + index * 60, 650, spriteKey).setInteractive();
        self.input.setDraggable(card);
        card.setData('uid', uid); // Store real server ID on the object
        self.myHandGroup.add(card);
      });
      
      console.log("Bonuses:", data.bonuses);
    });

    // --- Action Button ---
    this.drawButton = this.add.text(1000, 600, ['DRAW TILE'])
      .setFontSize(18).setColor('#00ff00').setInteractive()
      .on('pointerdown', () => {
        self.socket.emit("drawCard");
      });

    // --- Input Handling ---
    this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on("drop", function (pointer, gameObject, dropZone) {
      if (dropZone === self.dropZone) {
        // Player tries to play card
        let uid = gameObject.getData('uid');
        self.socket.emit("cardPlayed", uid);
        gameObject.destroy(); 
      }
    });
  }
  addCardToZone(sprite) {
    let card = new Card(this);
    card.render(this.dropZone.x, this.dropZone.y, sprite);
  }

  update() {
    //updates the game possibly every frame; things you want the computer to watch
  }
}
