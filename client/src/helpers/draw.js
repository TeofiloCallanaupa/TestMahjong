import Card from './card';
//this class draws/renders the card on the canvas

export default class Draw {
    constructor(scene) {
        this.drawCard = () => {
            let cardDrew = 'whiteDragon'; 
            let opponentCardDrew = 'tileBack';

            let newPlayerCard = new Card(scene)
            newPlayerCard.render(1100, 650, cardDrew)

            let newOpponentCard = new Card(scene);
            scene.opponentCards.push(newOpponentCard.render(1100, 125, opponentCardDrew).disableInteractive());
        }
    }
}