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
    background("peach");
    
    myGame.initCards();
    myGame.initPlayers();
}


