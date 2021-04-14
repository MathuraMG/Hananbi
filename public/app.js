let socket = io();
let myGame;

//Listen for confirmation of connection
socket.on('connect', () => {
    console.log("Connected");
});

socket.on('startGame', (data) => {
    socket.emit('setGameState', {state: myGame.state()})
    myGame.display();
    myGame.board.displayGameBoard(window.innerWidth/3 , window.innerHeight/2);
})

socket.on('loadGame', (data) => {
    myGame.setState(data.state);
    myGame.display();
    myGame.board.displayGameBoard(window.innerWidth/3 , window.innerHeight/2);
})

function setup() {
    myGame = new Game(3);
    myGame.initCards();
    myGame.initPlayers();
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