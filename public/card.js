// const { text } = require("express");

/** GLOBAL CONFIG **/
const CARDSIZE = {x:80, y:120};
const GROUPS = ["red", "yellow", "blue", "green", "white"];

class Card {
    constructor(number, group, id, game, player) {
        this.number = number;
        this.group = group;
        this.id = id;
        this.player = player || null;
        this.game = game;
    }

    state() {
        return {
            id: this.id,
            number: this.number,
            group: this.group
        }
    }

    display(x, y, canReveal) {
        let playButton, discardButton;
        if(canReveal) {
            fill(this.group);
            rect(x, y, CARDSIZE.x, CARDSIZE.y);
            fill(0);
            textSize(20);
            text(this.number, x+10, y+20);
        } else {
            fill("#aaaaaa");
            rect(x, y, CARDSIZE.x, CARDSIZE.y);
        }
        playButton = createButton('Play');
        discardButton = createButton('discard');
        playButton.position(x, y + CARDSIZE.y+30);
        discardButton.position(x, y + CARDSIZE.y+50);
        playButton.mousePressed(() => this.playCard());
        discardButton.mousePressed(() =>this.discardCard());

    }

    shorthand() {
        return this.number + this.group[0];
    }

    playCard() {
        // debugger;
        this.game.play(this, this.player);
    }

    discardCard() {
        this.game.discard(this, this.player);
    }
}
