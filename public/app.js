let socket = io();
let myGame;

//Listen for confirmation of connection
socket.on('connect', () => {
    console.log("Connected");
});

socket.on('startGame', (data) => {
    myGame = new Game(data.numPlayers);
    myGame.initCards();
    myGame.initPlayers();
    socket.emit('setGameState', {state: myGame.state()})
    myGame.display();
    myGame.board.displayGameBoard(window.innerWidth/3 , window.innerHeight/2);
})

socket.on('loadGame', (data) => {
    myGame.setState(data.state);
})

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
    
}


/** 
 
Client                   Server
connect --------------->
        <--------------- startGame
setGameState ----------->
        <--------------- setGameState
**/