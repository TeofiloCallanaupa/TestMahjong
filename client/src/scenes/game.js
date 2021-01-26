import Card from "../helpers/card";
import Zone from "../helpers/zone";
import MyZone from "../helpers/myZone"
import Dealer from "../helpers/dealer";
import Draw from "../helpers/draw";
import io from "socket.io-client";

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
    this.load.image("flowerA1", "src/assets/FlowerA1.png");
    this.load.image("flowerA2", "src/assets/FlowerA2.png");
    this.load.image("flowerA3", "src/assets/FlowerA3.png");
    this.load.image("flowerA4", "src/assets/FlowerA4.png");
    this.load.image("flowerB1", "src/assets/FlowerB1.png");
    this.load.image("flowerB2", "src/assets/FlowerB2.png");
    this.load.image("flowerB3", "src/assets/FlowerB3.png");
    this.load.image("flowerB4", "src/assets/FlowerB4.png");
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
    // self.stage.backgroundColor = "#4488AA"
    this.playerCount = 0;
    this.isPlayerA = false;
    this.isPlayerB = false;
    this.isPlayerC = false;
    this.isPlayerD = false;
    this.opponentCards = [];

    //this is how we test just one card
    //##########
    // //info about the card you are rendering on the screen
    // //maybe later use models for all the cards
    // this.card = this.add.image(300, 300, 'greenDragon').setInteractive();

    // //letting the card be draggable
    // this.input.setDraggable(this.card);
    //##########

    //creates a new zone for the cards
    this.zone = new Zone(this);
    this.dropZone = this.zone.renderZone();
    this.outline = this.zone.renderOutline(this.dropZone);
    this.myZone = new MyZone(this);
    this.myDropZone = this.myZone.renderMyZone();
    this.outline = this.myZone.renderOutline(this.myDropZone);
    this.dealer = new Dealer(this);
    this.draw = new Draw(this);
    this.currTiles = Phaser.Utils.Array.Shuffle(this.dealer.allTiles);
    let me = 1;

    //change this when you're using a live server
    this.socket = io("http://localhost:1337");

    this.socket.on("connect", function () {
      console.log("Connected!");
    });

    this.socket.on("currentPlayers", function (players) {
      for (let curr = 0; curr < players.length; curr++) {
        if (players[curr] === self.socket.id) {
          me += curr;
        }
      }
    });

    if (me === 1) {
      this.socket.on("isPlayerA", function () {
        // if(this.playerCount === 1){
        self.isPlayerA = true;
        console.log(me);
        // this.playerCount++;
        // }
        // if(this.playerCount === 2){
        //     self.isPlayerB = true;
        //     self.isPlayerA = false;
        //     this.playerCount++;
        // }
      });
    }
    if (me === 2) {
      this.socket.on("isPlayerB", function () {
        self.isPlayerB = true;
        self.isPlayerA = false;
        console.log(me);
      });
    }
    // let test = ['dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonGreen', 'dragonGreen', 'dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen']
    // if(self.isPlayerA) {
        // test = ['dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed']
    this.socket.on("dealCards", function () {
        // test = test.splice(0,12)
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        });
    // }
    // else{ 
    //     // test = ['dragonGreen', 'dragonGreen', 'dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen']
    //         this.socket.on("dealCards", function () {
    //                 // test = ['dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed']
    //                 self.dealer.dealCards(test);
    //                 self.dealText.disableInteractive();
    //             });
    //         }
    //dealCars (hand,isPlayerA){
    //  if (isPlayerA)
    // }

    this.socket.on("drawCard", function (isPlayerA) {
        if (isPlayerA !== self.isPlayerA) {
            self.draw.curr++
        self.draw.drewCard();
        }
    });

    //sends info that card is played to other players
    this.socket.on("cardPlayed", function (gameObject, isPlayerA) {
      if (isPlayerA !== self.isPlayerA) {
          console.log('generaaaaaaal',isPlayerA)
          console.log('meeeeeeeee',self.isPlayerA)
        let sprite = gameObject.textureKey;
        self.opponentCards.pop().destroy();
        self.dropZone.data.values.cards++;
        let card = new Card(self);
        card
        .render(
            self.dropZone.x - 360 + ((self.dropZone.data.values.cards%15) * 50),
            self.dropZone.y - 200 + ((~~(self.dropZone.data.values.cards/15)) * 60),
            sprite
            )
        }
    });
    
    this.socket.on("cardBenched", function(gameObject, isPlayerA) {
        if (isPlayerA !== self.isPlayerA) {
            let pic = gameObject.textureKey;
            self.opponentCards.pop().destroy();
            self.myDropZone.data.values.cards++;
            let card = new Card(self);
            card.render(
                self.myDropZone.x-360 + self.myDropZone.data.values.cards * 50, 
                self.myDropZone.y-660, 
                pic
                )
                  .disableInteractive();
        }
    })
    //now moved to dealer.js
    // //our dealCards function
    // //uses the Card class to make a bunch of new cards
    // this.dealCards = () => {
    //     for (let i = 0; i < 5; i++){
    //         let playerCard = new Card(this);
    //         playerCard.render(475 + (i*50), 650, 'greenDragon')
    //     }

    // }

    //will become out button to deal starting card/tile
    this.dealText = this.add
      .text(0, 0, ["DEAL TILES"])
      .setFontSize(18)
      .setColor("#DED112")
      .setInteractive();
    this.drawText = this.add
      .text(0, 20, ["DRAW A TILE"])
      .setFontSize(18)
      .setColor("#DED112")
      .setInteractive();

    //when you click, you deal cards
    this.dealText.on("pointerdown", function () {
      self.socket.emit("dealCards");
    });

    //change color when mouse goes over
    this.dealText.on("pointerover", function () {
      self.dealText.setColor("#ff69b4");
    });

    //change color back when the mouse leaves
    this.dealText.on("pointerout", function () {
      self.dealText.setColor("#DED112");
    });

    //when you click, you draw a card
    this.drawText.on("pointerdown", function () {
      self.draw.drawCard();
        self.socket.emit("drawCard", self.isPlayerA);
    });

    //change color when mouse goes over
    this.drawText.on("pointerover", function () {
      self.drawText.setColor("#ff69b4");
    });

    //change color back when the mouse leaves
    this.drawText.on("pointerout", function () {
      self.drawText.setColor("#DED112");
    });

    //do stuff while dragging
    this.input.on("dragstart", function (pointer, gameObject) {
      gameObject.setTint(0xded112);
      // attempt at making the tile bigger when dragging
      // gameObject.setScale(1.3,1.3)
      // gameObject.setSize(140, 140);
      self.children.bringToTop(gameObject);
    });

    // attempt at changing color when draging in a tile
    // this.input.on('dragenter', function(pointer, gameObject, zone){
    //     // zone.graphics.clear();
    //     zone.renderOutline.graphics.lineStyle(10, 0x00ffff)
    // })
    //stop doing stuff when dragging finished
    this.input.on("dragend", function (pointer, gameObject, dropped) {
      gameObject.setTint();
      // this is if i want it to go back to its original spot if i dont drop the tile in a drop zone
    //   if (!dropped) {
    //     gameObject.x = gameObject.input.dragStartX;
    //     gameObject.y = gameObject.input.dragStartY;
    //   }
    });

    //drags the gameObject(card) since its setInteractive()
    this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
    //this variable renders once in each player's browser
    let benchVar = -1
    this.input.on("drop", function (pointer, gameObject, dropZone) {
        if(dropZone===self.dropZone){
            dropZone.data.values.cards++;

          gameObject.x = dropZone.x - 360 + ((dropZone.data.values.cards%15) * 50);
          gameObject.y = dropZone.y - 200 + ((~~(dropZone.data.values.cards/15)) * 60);
          //   gameObject.disableInteractive();
          self.socket.emit("cardPlayed", gameObject, self.isPlayerA);
        }else if(dropZone===self.myDropZone){
            // this variable gets carried over to every player
            // dropZone.data.values.cards++;
            benchVar++
            gameObject.x = dropZone.x -360 + benchVar * 50;
            gameObject.y = dropZone.y;
            gameObject.disableInteractive();
            self.socket.emit("cardBenched", gameObject, self.isPlayerA);
        }
    });
    //attempt at trying to make the cards bigger when pointerover
    // this.input.on('pointerover', function(pointer, gameObject) {
    //     gameObject.setScale(1.3,1.3);
    // })
    //
    //self.socket.emit("deal", deck, self.isPlayerA)
  }

  update() {
    //updates the game possibly every frame; things you want the computer to watch
  }
}
