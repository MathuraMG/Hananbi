/** GLOBAL CONFIG **/ 
const CARDSIZE = {x:80, y:120};

function removeButtons() {
    $('button').remove();
}


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
        console.log(` ${this.shorthand() } card played`)
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
        this.gameStack = {};
        this.discardPile = [];
    }

    addToDiscardPile(card) {
        this.discardPile.push(card);
    }
    
    displayDiscardPile() {
        this.discardPile.forEach((card, index)=> {
            card.display()
        })
    }
}

class Clue {

}

class Game {
    constructor(noPlayers) {
        this.noPlayers = noPlayers;
        this.numbers = [1,1,1,2,2,3,3,4,4,5];
        this.groups = ["red", "green", "blue","yellow","white"]; 
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
    }
}



