// const { text } = require("express");

/** GLOBAL CONFIG **/
const CARDSIZE = {x:80, y:120};
const GROUPS = ["red", "yellow", "blue", "green", "white"];

class Card {
    constructor(number, group, id, game, player) {
        this.number = number;
        this.group = group;
        this.id = id;
        this.numberRevealed = false;
        this.groupRevealed = false;
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

    display(props) {
        let playButton, discardButton;
        let groupClueButton, numberClueButton;
        let x = props.x;
        let y = props.y;

        props.hide ? this.displayHiddenCards(props) : this.displayRevealedCards(props);
    }

    displayHiddenCards(props) {
        let playButton, discardButton;
        let x = props.x;
        let y = props.y;

        fill("#aaaaaa");
        rect(x, y, CARDSIZE.x, CARDSIZE.y);
        playButton = createButton('Play');
        discardButton = createButton('discard');
        playButton.position(x, y + CARDSIZE.y+30);
        discardButton.position(x, y + CARDSIZE.y+50);
        playButton.mousePressed(() => this.playCard());
        discardButton.mousePressed(() =>this.discardCard());
    }

    displayRevealedCards(props) {
        let groupClueButton, numberClueButton;
        let x = props.x;
        let y = props.y;

        fill(this.group);
        rect(x, y, CARDSIZE.x, CARDSIZE.y);
        fill(0);
        textSize(20);
        text(this.number, x+10, y+20);
        fill(0);
        numberClueButton = createButton(this.number);
        groupClueButton = createButton(this.group);
        numberClueButton.position(x, y + CARDSIZE.y+30);
        groupClueButton.position(x, y + CARDSIZE.y+50);
        numberClueButton.mousePressed(() => this.numberClue(this.number));
        groupClueButton.mousePressed(() =>this.groupClue(this.group));
        if(this.game.clueTokens <= 0) {
            numberClueButton.attribute('disabled', 'disabled');
            groupClueButton.attribute('disabled', 'disabled');
        }
    }

    numberClue() {
        this.game.clueTokens -= 1;
        this.game.display({currentPlayer});
        console.log(this.game.clueTokens);
    }
    groupClue() {
        this.game.clueTokens -= 1;
        this.game.display({currentPlayer});
        console.log(this.game.clueTokens);
    }
    shorthand() {
        return this.number + this.group[0];
    }

    playCard() {
        // debugger;
        this.game.play(this, this.player);
    }

    discardCard() {
        this.game.clueTokens = min(this.game.clueTokens+1, this.game.maxClueTokens);
        console.log(this.game.clueTokens);
        this.game.discard(this, this.player);
    }
}
