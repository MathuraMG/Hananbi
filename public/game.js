class Game {
    constructor(noPlayers) {
        this.noPlayers = noPlayers;
        this.numbers = [1,1,1,2,2,3,3,4,4,5];
        this.groups = GROUPS;
        this.board = new Board({ game: this });
        this.players = [];
        // this.playerNumber = 0;
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

    state() {
        return {
            board: this.board.state(),
            players: this.players.map((player) => player.state())
        }
    }

    setState(state) {
        this.board.setState(state.board);
        state.players.forEach(playerState => {
            this.player(playerState.id).setState(playerState);
        })
    }

    player(id) {
        return this.players.find(player => player.id === id)
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

    display(props) {
        background("peachpuff");
        removeButtons();
        for(let i=0;i<this.noPlayers;i++) {
            let hide = (i == props.player) ;

            this.players[i].display({x:0, y:(CARDSIZE.y +50) * i,hide:hide});
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
