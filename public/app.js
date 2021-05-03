let socket = io();
let myGame;
let currentPlayer;

//Listen for confirmation of connection
socket.on('connect', () => {
    console.log("Connected");
});

socket.on('startGame', (data) => {
    socket.playerId = data.player; // NOTE: Are we using this anywhere?
    currentPlayer = data.player;
    startGame(data);
});

socket.on('loadGame', (data) => {
    
    socket.playerId = data.player; // NOTE: Are we using this anywhere?
    if (data.player) {
      currentPlayer = data.player;
    }
    loadGame(data);
});

function startGame(data) {
    if (myGame) {
        myGame.update();
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
    noStroke();
    createCanvas(BOARD.width, BOARD.height);
}

window.onbeforeunload = function() {
  return "Game will crash for EVERYONE if you leave page. STAY.";
};
