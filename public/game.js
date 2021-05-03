class Game {
    constructor(noPlayers) {
        this.noPlayers = noPlayers;
        this.numbers = [1,1,1,2,2,3,3,4,4,5];
        this.groups = GROUPS;
        this.board = new Board({ game: this });
        this.players = [];
        this.playerTurn = 0;
        this.clueTokens = 8;
        this.maxClueTokens = 8;
    }

    initCards() {
        let deck = [];
        for(let i=0; i<this.groups.length; i++)
        {
            for(let j=0;j<this.numbers.length;j++) {
                deck.push(new Card({
                    number: this.numbers[j],
                    group: this.groups[i],
                    id: j*this.groups.length + i,
                    game: this
                }));
            }
        }
        shuffle(deck, true);
        console.log(deck)
        this.board.deck= deck;
    }

    initPlayers() {
        for(let i = 0;i<this.noPlayers;i++) {
           this.players.push(new Player(i, this));

           for(let j=0;j<5;j++) {
               this.dealCard(this.players[i]);
           }
        }
    }

    state() {
        return {
            board: this.board.state(),
            players: this.players.map((player) => player.state()),
            clueTokens: this.clueTokens,
            playerTurn: this.playerTurn
        }
    }

    setState(state) {
        this.board.setState(state.board);

        state.players.forEach(playerState => {
            this.player(playerState.id).setState(playerState);
        });

        this.clueTokens = state.clueTokens;
        this.playerTurn = state.playerTurn;
    }

    update() {
      socket.emit('setGameState', {state: this.state()});
      this.display({currentPlayer});
    }

    discard(card, player) {
        if (!this.yourTurn()) { return };

        player.removeCard(card);
        this.board.addToDiscardPile(card);
        this.dealCard(player);
        this.endTurn();

        this.log();
        this.update();
    }

    play(card, player) {
        if (!this.yourTurn()) { return };

        player.removeCard(card);
        this.board.playCard(card);
        this.dealCard(player);
        this.endTurn();

        this.log();
        this.update();
    }

    numberClue(card) {
      if (!this.yourTurn()) { return };

      let player = card.player;
      let number = card.number
      player.cards.forEach((card) => {
        if (card.number == number) {
          card.numberRevealed = true;
        }
      })
      this.clueTokens -= 1;
      this.endTurn();

      this.log();
      this.update();
    }

    groupClue(card) {
      if (!this.yourTurn()) { return };

      let player = card.player;
      let group = card.group
      player.cards.forEach((card) => {
        if (card.group == group) {
          card.groupRevealed = true;
        }
      })
      this.clueTokens -= 1;
      this.endTurn();

      this.log();
      this.update();
    }

    player(id) {
        return this.players.find(player => player.id === id)
    }

    yourTurn() {
      return currentPlayer === this.playerTurn;
    }

    endTurn() {
      this.playerTurn = (this.playerTurn + 1) % this.players.length
    }

    dealCard(player) {
        let card = this.board.deck.pop();
        card.player = player;
        player.cards.push(card);
    }

    log() {
        this.players.forEach(function(player) {
            let playerCards = player.cards.map((card) => card.shorthand());
            console.log(`Player ${player.id} : ` + playerCards.join(", "));
        })
    }

    display(props) {
        background(BACKGROUND);
        removeButtons();
        this.displayClues();
        this.board.displayGameBoard(window.innerWidth/3 , window.innerHeight/2);
        this.board.displayDiscardPile(window.innerWidth-100, window.innerHeight-100);
        for(let i=0;i<this.noPlayers;i++) {
            let hide = (i == props.currentPlayer) ;
            this.players[i].display({ x: BOARD.padding, y:(CARDSIZE.y) * i * 2 + CARDSIZE.y/2, hide: hide });
        }
    }

    displayClues() {
      fill(0);
      textSize(20);
      text(`Clues: ${this.clueTokens}`, 0, 20);
    }
}
