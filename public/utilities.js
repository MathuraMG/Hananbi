const { listen } = require("socket.io");

function removeButtons() {
    $('button').remove();
}

function cross(x,y,width,colour) {
    push();
    stroke(colour);
    strokeWeight(5);
    line(x,y,x+width,y+width);
    line(x,y+width,x+width,y);
    pop();
}