import Card from './card';
//this class draws/renders the card on the canvas

export default class Draw {
    constructor(scene) {
        this.curr = -1;
        //TODO: drawCard function that draws from the deck
        //do something like get deck, and that becomes this.hand
        //
        this.drawCard = () => {
            let cardDrew = 'whiteDragon';
            this.hand = [ "sticks2",
            // "sticks3",
            // "maahn5",
            // "balls4",
            // "balls8",
            // "sticksChicken",
            // "maahn9",
            // "maahn8",
            // "flowerB4",
            // "maahn4",
            // "windSouth",
            // "maahn9",
            "maahn8",
            "balls1",
            "balls2",]

            // card drew
            let newPlayerCard = new Card(scene)
            this.curr++;
            newPlayerCard.render(1100, 1125, this.hand[this.curr])
            // left pop
            this.hand = this.hand.splice(0,1)
            
        }
        //shows the opp the back of the tile when you draw a tile
        this.drewCard = () => {
            let opponentCardDrew = 'tileBack';
            let newOpponentCard = new Card(scene);
            scene.opponentCards.push(newOpponentCard.render(1100, 125, opponentCardDrew).disableInteractive());

        }
    }
}