const server = require('express');
const app = server()
const http = require('http').createServer(app);
//screw cors
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
});
// const dealer = require('./client/src/helpers/dealer')
let players = []

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);
    
    players.push(socket.id);
    console.log('Current players: ' + players)

    if(players.length === 1) {
        console.log('PlayerA: ' + socket.id)
        io.emit('isPlayerA');
    };
    if(players.length === 2) {
        console.log('PlayerB: ' + socket.id)
        io.emit('isPlayerB');
    };
    if(players.length === 3) {
        console.log('PlayerC: ' + socket.id)
        io.emit('isPlayerC');
    };
    if(players.length === 4) {
        console.log('PlayerD: ' + socket.id)
        io.emit('isPlayerD');
    };

    socket.on("join_room", room => {
        socket.join(room);
    });

    socket.on("decking", data => {
        const {room, deck} = data
        socket.to(room).emit("decking",{
            deck,
            name: "Player1"
        })
    })

    socket.on("pickingUp",({room})=> {
        socket.to(room).emit("pickingUp")
    })


    //when you recieve dealCards, send it to everyone
    socket.on('dealCards', function(test) {
        // test = ['dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonRed','dragonGreen', 'dragonGreen', 'dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen','dragonGreen']
        io.emit('dealCards',test);
    });

    socket.on('drawCard', function(){
        io.emit('drawCard')
    })

    socket.on('cardPlayed', function(gameObject, isPlayerA) {
        io.emit('cardPlayed', gameObject, isPlayerA);
    });

    //who dc and remove player
    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id)
        console.log('Current players: ' + players)
    });
})


http.listen(1337, function () {
    console.log('Server started!');
})