import Card from './card';
//this class draws/renders the card on the canvas

export default class Draw {
    constructor(scene) {
        this.curr = -1;
        this.drawCard = () => {
            let cardDrew = 'whiteDragon';
            let hand = [ "sticks2",
            "sticks3",
            "maahn5",
            "balls4",
            "balls8",
            "sticksChicken",
            "maahn9",
            "maahn8",
            "flowerB4",
            "maahn4",
            "windSouth",
            "maahn9",
            "maahn8",
            "balls1",
            "balls2",]
            let newPlayerCard = new Card(scene)
            this.curr++;
            newPlayerCard.render(1100, 1125, hand[this.curr])
            hand.splice(0,1)
            
        }
        this.drewCard = () => {
            let opponentCardDrew = 'tileBack';
            let newOpponentCard = new Card(scene);
            scene.opponentCards.push(newOpponentCard.render(1100, 125, opponentCardDrew).disableInteractive());

        }
    }
}