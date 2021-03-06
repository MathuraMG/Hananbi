class Card {
    constructor(props) {
        this.number = props.number;
        this.group = props.group;
        this.id = props.id;
        this.numberRevealed = props.numberRevealed || false;
        this.groupRevealed = props.groupRevealed || false;
        this.player = props.player || null;
        this.game = props.game;
    }

    state() {
        return {
            id: this.id,
            number: this.number,
            group: this.group,
            numberRevealed: this.numberRevealed,
            groupRevealed: this.groupRevealed
        }
    }

    display(props) {
        if(this.groupRevealed || this.numberRevealed) {
            this.displayClue(props);
        }

        let hideCards = props.hide && !this.game.gameOver;

        hideCards ? this.displayHiddenCards(props) : this.displayRevealedCards(props);
    }

    displayClue(props) {
      let x = props.x;
      let y = props.y - CLUESIZE.fontSize - CLUESIZE.padding;
      let fillColor = this.groupRevealed ? CLUECOLORS[this.group] : CLUECOLORS["grey"];
      fill(fillColor);
      rect(x, y, CLUESIZE.x, CLUESIZE.y, CLUESIZE.radius);

      if (this.numberRevealed) {
        fill(COLORS.white);
        textSize(CLUESIZE.fontSize);
        text(this.number, x+CLUESIZE.padding, y + CLUESIZE.fontSize + CLUESIZE.padding/3);
      }
    }

    displayHiddenCards(props) {
        let playButton, discardButton;
        let x = props.x;
        let y = props.y;

        fill(CARDCOLORS.grey);
        rect(x, y, CARDSIZE.x, CARDSIZE.y,CARDSIZE.radius);
        if (this.game.yourTurn() && !this.game.gameOver) {
            playButton = createButton('Play');
            discardButton = createButton('Discard');
            playButton.addClass('actionButton');
            discardButton.addClass('actionButton');
            playButton.position(x, y + CARDSIZE.y+20);
            discardButton.position(x, y + CARDSIZE.y+50);
            playButton.mousePressed(() => this.playCard());
            discardButton.mousePressed(() =>this.discardCard());

            //style the buttons
            playButton.style('width', `${CARDSIZE.x}px`);
            discardButton.style('width', `${CARDSIZE.x}px`);

        }
    }

    displayRevealedCards(props) {
        let groupClueButton, numberClueButton;
        let x = props.x;
        let y = props.y;

        fill(CARDCOLORS[this.group]);
        rect(x, y, CARDSIZE.x, CARDSIZE.y,CARDSIZE.radius);
        //number shadow
        fill(COLORS.shadow);
        textSize(CARDSIZE.fontSize);
        text(this.number, x+CARDSIZE.padding+5, y+CARDSIZE.y-CARDSIZE.padding+5);
        //number
        fill(COLORS.white);
        textSize(CARDSIZE.fontSize);
        text(this.number, x+CARDSIZE.padding, y+CARDSIZE.y-CARDSIZE.padding);
        // fill(0);
        if (this.game.yourTurn() && !this.game.gameOver) {
            numberClueButton = createButton(this.number);
            groupClueButton = createButton(this.group);
            //styles
            numberClueButton.addClass('actionButton');
            numberClueButton.style('width', `${CARDSIZE.x}px`);
            groupClueButton.addClass('actionButton');
            groupClueButton.style('width', `${CARDSIZE.x}px`);

            numberClueButton.position(x, y + CARDSIZE.y+20);
            groupClueButton.position(x, y + CARDSIZE.y+50);
            numberClueButton.mousePressed(() => this.numberClue(this.number));
            groupClueButton.mousePressed(() =>this.groupClue(this.group));
            if(this.game.clueTokens <= 0) {
                numberClueButton.attribute('disabled', 'disabled');
                groupClueButton.attribute('disabled', 'disabled');
            }
        }
    }

    numberClue() {
        this.game.numberClue(this);
    }
    groupClue() {
        this.game.groupClue(this);
    }
    shorthand() {
        return this.number + this.group[0];
    }

    playCard() {
        this.game.play(this, this.player);
    }

    discardCard() {
        this.game.clueTokens = min(this.game.clueTokens+1, this.game.maxClueTokens);
        console.log(this.game.clueTokens);
        this.game.discard(this, this.player);
    }
}
