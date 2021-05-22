let express = require('express');
let app = express();

// ---------------------
// Game stuff
// ---------------------

let games = {};

let maxPlayers, players, gameState;

function initializeGame() {
  let gameKey = "ABCD"
  games[gameKey] = {
    maxPlayers: 3,
    players: [null, null, null],
    gameState: null
  }
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

function emptyLobby(game) {
  return game.players.every((player) => !player);
}

function nextAvailableSeat(game) {
  let seat = game.players.indexOf(null);

  return (seat >= 0) ? seat : null;
}

function nextAvailableGame() {
  for (const gameKey in games) {
    let game = games[gameKey]

    if (nextAvailableSeat(game) !== null) {
      return game;
    }
  }

  return null;
}

function newPlayer(props) {
  let playerNumber = props.playerNumber;
  let id = props.id;

  return {
    id: id,
    name: `Player ${playerNumber + 1}`
  }
}

io.sockets.on('connection', function(socket){
  let game = nextAvailableGame();

  if (game) {
    if (emptyLobby(game)) {
      let nextSeat = nextAvailableSeat(game);
      console.log(`${socket.id}: Joined the game.`);
      console.log(`${socket.id}: Starting the game.`);
      console.log(`${socket.id}: Sitting in seat ${nextSeat}.`);

      games["ABCD"].players[nextSeat] = newPlayer({playerNumber: nextSeat, id: socket.id});

      io.to(socket.id).emit('startGame', {
          numPlayers: games["ABCD"].maxPlayers,
          player: nextSeat
      });

      io.to("ABCD").emit('loadProfiles', { profiles: games["ABCD"].players });
    } else {
      let nextSeat = nextAvailableSeat(game);
      console.log(`${socket.id}: Joined the game.`);

      if (nextSeat !== null) {
        console.log(`${socket.id}: Sitting in seat ${nextSeat}.`);

        games["ABCD"].players[nextSeat] = newPlayer({playerNumber: nextSeat, id: socket.id});

        io.to(socket.id).emit('loadGame', {
            state: games["ABCD"].gameState,
            player: nextSeatx
        });

        console.log()
        io.to("ABCD").emit('loadProfiles', { profiles: games["ABCD"].players });
      } else {
        console.log(`${socket.id}: Game full.`);
      }
    }
  } else {
    console.log(`${socket.id}: No games available.`);
  }

  socket.on('setGameState', function(data) {
      games["ABCD"].gameState = data.state;
      socket.to("ABCD").broadcast.emit('loadGame', { state: games["ABCD"].gameState });
  })

  //Listen for this client to disconnect
  socket.on('disconnect', function() {
      console.log(`${socket.id}: Left the game.`);
      let playerNumber = games["ABCD"].players.findIndex((player) => (player && (socket.id === player.id)));
      games["ABCD"].players[playerNumber] = null;

      io.to("ABCD").emit('loadProfiles', { profiles: games["ABCD"].players });
  });
})
