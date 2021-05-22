let socket = io();
let myGame;
let currentPlayer;
let playerProfiles = {};

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

socket.on('loadProfiles', (data) => {
  playerProfiles = data.profiles;
  if (myGame) {
    myGame.display({currentPlayer});
  }
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
    background(BACKGROUND);
    push();
    textSize(CARDSIZE.fontSize);
    fill(COLORS.white);
    text("Kinabi. Loading...", 20, BOARD.height/2 - CARDSIZE.fontSize/2);
    pop();
}

window.onbeforeunload = function() {
  return "Game will crash for EVERYONE if you leave page. STAY.";
};
