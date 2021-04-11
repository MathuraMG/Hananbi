class Card {
    constructor(number, group) {
        this.number = number;
        this.group = group;
    }
    display() {
        fill(this.group);
        textSize(20);
        text(this.number, 10,20);
        rect(0,0,40,60)
    }
    shorthand() {
        return this.number + this.group[0];
    }
}


class Player {
    constructor(id) {
        this.id = id;
        this.cards = [];
        this.noCards = 5;
        
    }
    
    playCard() {

    }

    discardCard() {

    }

    giveClue() {

    }
}

class Board {
    constructor() {
        this.deck = [];
        this.clueTokens = 8;
        this.gameStack = {}
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
                deck.push(new Card(this.numbers[j], this.groups[i]));
            }
        }
        shuffle(deck, true);
        console.log(deck)
        this.board.deck= deck;
    }

    dealCard(player) {
        player.cards.push(this.board.deck.pop())
    }
 
    initPlayers() {
        for(let i = 0;i<this.noPlayers;i++) {
           this.players.push(new Player(i)) 
           for(let j=0;j<5;j++) {
               this.dealCard(this.players[i])
           }
        }
        console.log(this.players) ;
    }

    log() {
        this.players.forEach(function(player) {
            let playerCards = player.cards.map((card) => card.shorthand());
            console.log(`Player ${player.id} : ` + playerCards.join(", "));
        })
    }

}



