let socket = io();
let myGame;

//Listen for confirmation of connection
socket.on('connect', () => {
    console.log("Connected");
});

socket.on('startGame', (data) => {
    startGame(data);
});

socket.on('loadGame', (data) => {
    loadGame(data);
});

function startGame(data) {
    if (myGame) {
        socket.emit('setGameState', {state: myGame.state()});
        myGame.display();
        myGame.board.displayGameBoard(window.innerWidth/3 , window.innerHeight/2);
    } else {
        setTimeout((() => startGame(data)), 1000);
    }
}

function loadGame(data) {
    if (myGame) {
        myGame.setState(data.state);
        myGame.display();
        myGame.board.displayGameBoard(window.innerWidth/3 , window.innerHeight/2);
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
