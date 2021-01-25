import Phaser from 'phaser';
import Game from './scenes/game'
// import io from 'socket.io-client'

const config = {
    type: Phaser.AUTO,
    //parent makes a canvas div w/ id 
    backgroundColor: '#007C00',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'phaser-example',
        width: 1350,
        height: 1250,
    },
    scene: [
        Game
    ],
};

const newGameBtn = document.getElementById('newGameButton');
const joinGameBtn = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const initialScreen = document.getElementById('initialScreen')

newGameBtn.addEventListener('click', newGame);
joinGameBtn.addEventListener('click', joinGame);

//put the game in a func 
function newGame(){
    const game = new Phaser.Game(config);
    initialScreen.style.display = 'none';
    
}

//join a game
function joinGame(){
    const code = gameCodeInput.value;
}