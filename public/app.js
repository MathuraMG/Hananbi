let socket = io();
let myGame;

//Listen for confirmation of connection
socket.on('connect', function() {
    console.log("Connected");
});

function preload() {
    myGame = new Game(2);
}
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
   
    
    myGame.initCards();
    myGame.initPlayers();
    // myGame.board.initGameBoard();
    // background("peachpuff");
    
    myGame.display();
    myGame.board.displayGameBoard(window.innerWidth/3 , window.innerHeight/2);
}

function draw() {
    
}


