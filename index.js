let express = require('express');
let app = express();

// ---------------------
// Game stuff
// ---------------------

let maxPlayers, players, gameState;

function initializeGame() {
  maxPlayers = 3;
  players = [null, null, null];
  gameState = null;
}

initializeGame();

// ---------------------
// Web stuff
// ---------------------

app.get('/reset', function(req, res) {
  initializeGame();
  res.send('Game reset');
});

app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

// ---------------------
// Socket stuff
// ---------------------

let io = require('socket.io').listen(server);

function emptyLobby() {
  return players.every((player) => !player);
}

function nextAvailableSeat() {
  return players.indexOf(null);
}

function newPlayer(props) {
  let playerNumber = props.playerNumber;
  let id = props.id;

  return {
    id: id,
    name: `Player ${playerNumber}`
  }
}

io.sockets.on('connection', function(socket){
    if (emptyLobby()) {
      let nextSeat = nextAvailableSeat();
      console.log(`${socket.id}: Joined the game.`);
      console.log(`${socket.id}: Starting the game.`);

      players[nextSeat] = newPlayer({playerNumber: nextSeat, id: socket.id});

      io.to(socket.id).emit('startGame', {
          numPlayers: maxPlayers,
          player: nextSeat
      });
    } else {
      let nextSeat = nextAvailableSeat();
      console.log(`${socket.id}: Joined the game.`);

      if (nextSeat >= 0) {
        console.log(`${socket.id}: Sitting in seat ${nextSeat}.`);

        players[nextSeat] = newPlayer({playerNumber: nextSeat, id: socket.id});

        io.to(socket.id).emit('loadGame', {
            state: gameState,
            player: nextSeat
        });
      } else {
        console.log(`${socket.id}: Game full.`);
      }
    }

    socket.on('setGameState', function(data) {
        gameState = data.state;
        socket.broadcast.emit('loadGame', { state: gameState });
    })

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log(`${socket.id}: Left the game.`);
        let playerNumber = players.findIndex((player) => socket.id === player.id);
        players[playerNumber] = null;
    });
})
