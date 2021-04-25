let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

let maxPlayers = 3;
let players = [];
let gameState = null;
//Initialize socket.io
let io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
    console.log("A new user has joined!" + socket.id);

    if (players.length === 0) {
        players.push({id: socket.id})
        io.to(socket.id).emit('startGame', {
            numPlayers: maxPlayers,
            player: 0
        });
    } else if (players.length < maxPlayers) {
        players.push({id: socket.id})
        io.to(socket.id).emit('loadGame', {
            state: gameState,
            player: players.length - 1
        });
    } else {
        // game is full - TBD
    }

    socket.on('setGameState', function(data) {
        gameState = data.state;
        socket.broadcast.emit('loadGame', { state: gameState });
    })

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
        players.splice(players.findIndex((player) => player.id === socket.id), 1);
    });

})
