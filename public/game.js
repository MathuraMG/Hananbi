class Game {
    constructor(noPlayers) {
        this.noPlayers = noPlayers;
        this.resetGame();
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
            strikes: this.strikes,
            timer: this.timer,
            gameOver: this.gameOver,
            playerTurn: this.playerTurn
        }
    }

    setState(state) {
        this.board.setState(state.board);

        state.players.forEach(playerState => {
            this.player(playerState.id).setState(playerState);
        });

        this.clueTokens = state.clueTokens;
        this.strikes = state.strikes;
        this.timer = state.timer;
        this.gameOver = state.gameOver;
        this.playerTurn = state.playerTurn;
    }

    update() {
      this.checkEndGame();

      socket.emit('setGameState', {
        gameKey: gameKey,
        state: this.state()
      });

      this.display({currentPlayer});
    }

    checkEndGame() {
      if (this.strikes >= this.maxStrikes) { this.gameOver = true; }
      if (this.timer === 0) { this.gameOver = true; }
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

    resetGame() {
      this.numbers = BOARD.numbers;
      this.groups = GROUPS;
      this.board = new Board({ game: this });
      this.players = [];
      this.playerTurn = 0;
      this.clueTokens = 8;
      this.maxClueTokens = 8;
      this.strikes = 0;
      this.maxStrikes = 3;
      this.gameOver = false;
      this.timer = this.noPlayers;
    }

    newGame() {
      this.resetGame();
      this.initCards();
      this.initPlayers();

      this.log();
      this.update();
    }

    play(card, player) {
        if (!this.yourTurn()) { return };

        player.removeCard(card);
        let validPlay = this.board.playCard(card);
        if (!validPlay) {
          this.strikes++;
        }
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
        if (!card) {
          this.timer--;
          return;
        }

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
        this.displayHUD();
        this.board.displayGameBoard(BOARD.padding + CARDSIZE.x*7 , BOARD.padding);
        this.displayGameStatus(BOARD.padding + CARDSIZE.x*9,BOARD.padding)
        this.players.forEach((player, i) => {
          let hide = (player.id == props.currentPlayer);
          let yourTurn = (this.playerTurn === player.id);

          player.display({
            x: BOARD.padding,
            y:(CARDSIZE.y) * i * 2 +BOARD.padding,
            hide: hide,
            yourTurn: yourTurn
          });
        });
    }

    displayGameStatus(x,y) {
      fill(COLORS.darkblue);
      rect(x,y,CARDSIZE.x*4, CARDSIZE.y*5+40);
      fill(COLORS.white);
      textSize(20);
      //clues
      for(let i=0;i<this.clueTokens;i++) {
        ellipse(x+CARDSIZE.x/2 + CARDSIZE.x*(i%4), y+CARDSIZE.x/2 +CARDSIZE.x*floor(i/4),CLUETOKEN.dia)
      }

      //strikes
      for(let i=0;i<this.strikes;i++) {
        cross(x+CARDSIZE.x*0.75 + CARDSIZE.x*i*1, y+2.5*CARDSIZE.x ,STRIKE.width,COLORS.red);
      }
      this.board.displayDiscardPile(x,CARDSIZE.x*5);
    }

    displayHUD() {
      push();
      fill(COLORS.white);
      textSize(20);
      if (this.gameOver) {
        text("Game over!", 0, 0);
        let rematchButton = createButton('Rematch');
        rematchButton.position(150, 0);
        rematchButton.mousePressed(() => this.newGame());
      }
      pop();
    }
}
