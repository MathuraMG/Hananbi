let socket = io();
let myGame;
let currentPlayer;

//Listen for confirmation of connection
socket.on('connect', () => {
    console.log("Connected");
});

socket.on('startGame', (data) => {
    startGame(data);
    socket.playerId = data.player; // NOTE: Are we using this anywhere?
    currentPlayer = data.player;
});

socket.on('loadGame', (data) => {
    loadGame(data);
    socket.playerId = data.player; // NOTE: Are we using this anywhere?
    currentPlayer = data.player;
});

function startGame(data) {
    if (myGame) {
        socket.emit('setGameState', {state: myGame.state()});
        myGame.display({currentPlayer});
    } else {
        setTimeout((() => startGame(data)), 1000);
    }
}

function loadGame(data) {
    if (myGame) {
        myGame.setState(data.state);
        myGame.display({currentPlayer});
    } else {
        setTimeout((() => loadGame(data)), 1000);
    }
}

function setup() {
    myGame = new Game(3);
    myGame.initCards();
    myGame.initPlayers();
    createCanvas(window.innerWidth, window.innerHeight);
}

window.onbeforeunload = function() {
  return "Game will crash for EVERYONE if you leave page. STAY.";
};
