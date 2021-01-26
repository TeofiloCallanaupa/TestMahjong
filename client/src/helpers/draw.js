import Card from './card';
//this class draws/renders the card on the canvas

export default class Draw {
    constructor(scene) {
        this.drawCard = () => {
            let cardDrew = 'whiteDragon'; 
            
            let newPlayerCard = new Card(scene)
            newPlayerCard.render(1100, 1125, cardDrew)
            
        }
        this.drewCard = () => {
            let opponentCardDrew = 'tileBack';
            let newOpponentCard = new Card(scene);
            scene.opponentCards.push(newOpponentCard.render(1100, 125, opponentCardDrew).disableInteractive());

        }
    }
}