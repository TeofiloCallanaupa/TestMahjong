export default class Deck {
    constructor(scene) {
        let deck = Phaser.Utils.Array.NumberArray(0, 143)
        Phaser.Utils.Array.Shuffle(deck)

        //next tile since we start at 0 
        nextTileIndex = 52
    }
}