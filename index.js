let express = require('express');
let app = express();

// ---------------------
// Game stuff
// ---------------------

let games = {};

let maxPlayers, players, gameState;

function initializeGame() {
  let gameKey = "ABCD";

  if (!gameKey) { return null; }

  games[gameKey] = {
    maxPlayers: 3,
    players: [null, null, null],
    gameState: null
  }

  console.log("Initialized game ABCD");

  return games[gameKey];
}

function newGameKey(retries) {
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  retries = retries || 0;

  let key = [sample(letters), sample(letters), sample(letters), sample(letters)].join("")

  if (!games[key]) {
    return key;
  } else if (retries < 3) {
    return newGameKey(retries + 1);
  } else {
    return null;
  }
}

function sample(array) {
    const randomIndex = Math.floor(Math.random() * array.length);

    return array[randomIndex];
}

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
  let game = nextAvailableGame() || initializeGame();

  if (game) {
    if (emptyLobby(game)) {
      let nextSeat = nextAvailableSeat(game);
      console.log(`${socket.id}: Joined the game.`);
      console.log(`${socket.id}: Starting the game.`);
      console.log(`${socket.id}: Sitting in seat ${nextSeat}.`);

      games["ABCD"].players[nextSeat] = newPlayer({playerNumber: nextSeat, id: socket.id});

      io.to(socket.id).emit('startGame', {
          gameKey: "ABCD",
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
            player: nextSeat
        });

        io.to("ABCD").emit('loadProfiles', { profiles: games["ABCD"].players });
      } else {
        console.log(`${socket.id}: Game full.`);
      }
    }
  } else {
    console.log(`${socket.id}: No games available.`);
  }

  socket.on('setGameState', function(data) {
      console.log(`${socket.id}: Set game state for game ${data.gameKey}`);
      let key = data.gameKey;
      games[key].gameState = data.state;
      socket.broadcast.emit('loadGame', { state: games[key].gameState });
  })

  //Listen for this client to disconnect
  socket.on('disconnect', function() {
      console.log(`${socket.id}: Left the game.`);
      let playerNumber = games["ABCD"].players.findIndex((player) => (player && (socket.id === player.id)));
      games["ABCD"].players[playerNumber] = null;

      io.to("ABCD").emit('loadProfiles', { profiles: games["ABCD"].players });

      if (emptyLobby(games["ABCD"])) {
        console.log("Game ABCD empty. Clearing game");
        delete games["ABCD"];
      }
  });
})
