// const { text } = require("express");

/** GLOBAL CONFIG **/ 
const CARDSIZE = {x:80, y:120};
const GROUPS = ["red", "yellow", "blue", "green", "white"];




class Card {
    constructor(number, group, id, game) {
        this.number = number;
        this.group = group;
        this.id = id;
        this.player = null;
        this.game = game;
    }
    
    display(x, y) {
        let playButton, discardButton;
        fill(this.group);
        rect(x, y, CARDSIZE.x, CARDSIZE.y);
        fill(0);
        textSize(20);
        text(this.number, x+10, y+20);
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

class Player {
    constructor(id, game) {
        this.id = id;
        this.game = game;
        this.cards = [];
        this.noCards = 5;    
    }

    removeCard(card) {
        this.cards.splice(this.cards.findIndex((handCard) => handCard.id === card.id), 1);
    }

    display(x, y) {
        for(let i=0;i<this.cards.length;i++) {
            this.cards[i].display(x + i * (CARDSIZE.x +20), y); 
        }
    }
}

class Board {
    constructor() {
        this.deck = [];
        this.clueTokens = 8;
        this.gameStack = [];
        this.discardPile = [];
        GROUPS.forEach((group, index)=> {
            this.gameStack[group] = [];
        })
        
    }

    addToDiscardPile(card) {
        this.discardPile.push(card);
    }
    
    displayDiscardPile(x,y) {
        this.discardPile.forEach((card, index)=> {
            fill(card.group);
            text(card.number,x+index*10, y);
        })
    }

    displayGameBoard(x,y) {
        GROUPS.forEach((group, index)=> {
            fill(group);
            rect(x+index*(CARDSIZE.x+30) , y, CARDSIZE.x, CARDSIZE.y);
            // debugger;
            if(this.gameStack[group].length > 0) {
                fill(0);
                let displayNumber = this.gameStack[group][this.gameStack[group].length-1];
                text(displayNumber,x+index*(CARDSIZE.x+30) , y);
            }
        })
    }

    checkisValidCard(card) {
        //check if stack already contains this number - INVALID
        if(this.gameStack[card.group].includes(card.number))
        {
            return false;
        } 
        //check if stack contains the prev number - VALID
        else if(this.gameStack[card.group].length>0 && this.gameStack[card.group].includes(card.number-1)) {
            return true;
        } 
        //check if card is 1
        else if(this.gameStack[card.group].length==0 && card.number==1) {
            return true;
        }
        else {
            return false;
        }
    }

    addToGameStack(card) {
        this.gameStack[card.group].push(card.number);
    }

    playCard(card) {
        if(this.checkisValidCard(card)) {
            this.addToGameStack(card);
        } else {
            this.addToDiscardPile(card);
        }
    }
}

class Clue {

}

class Game {
    constructor(noPlayers) {
        this.noPlayers = noPlayers;
        this.numbers = [1,1,1,2,2,3,3,4,4,5];
        this.groups = GROUPS;
        this.board = new Board();
        this.players = [];
    }
    initCards() {
        //create a random shuffle of the starter cards
        let deck = [];
        for(let i=0; i<this.groups.length; i++)    //5 colours
        {
            for(let j=0;j<this.numbers.length;j++) {
                deck.push(new Card(
                    this.numbers[j], 
                    this.groups[i],
                    j*this.groups.length + i,
                    this
                ));
            }
        }
        shuffle(deck, true);
        console.log(deck)
        this.board.deck= deck;
    }

    dealCard(player) {
        let card = this.board.deck.pop();
        card.player = player;
        player.cards.push(card);
    }
 
    initPlayers() {
        for(let i = 0;i<this.noPlayers;i++) {
           this.players.push(new Player(i, this));
           
           for(let j=0;j<5;j++) {
               this.dealCard(this.players[i]);
           }
        }
    }

    log() {
        this.players.forEach(function(player) {
            let playerCards = player.cards.map((card) => card.shorthand());
            console.log(`Player ${player.id} : ` + playerCards.join(", "));
        })
    }

    display() {
        background("peachpuff");
        removeButtons();
        for(let i=0;i<this.noPlayers;i++) {
            this.players[i].display(0, (CARDSIZE.y +50) * i);
        }
    }

    discard(card, player) {
        player.removeCard(card);
        this.board.addToDiscardPile(card);
        this.dealCard(player);
        this.log();
        this.display();
        this.board.displayDiscardPile(window.innerWidth-100, window.innerHeight-100);
        this.board.displayGameBoard(window.innerWidth/3, window.innerHeight/2);
    }

    play(card, player) {
        player.removeCard(card);
        this.board.playCard(card);
        this.dealCard(player);
        this.log();
        this.display();
        this.board.displayDiscardPile(window.innerWidth-100, window.innerHeight-100);
        this.board.displayGameBoard(window.innerWidth/3, window.innerHeight/2);
    }
}



