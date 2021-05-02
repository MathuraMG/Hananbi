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
        let playButton, discardButton;
        let groupClueButton, numberClueButton;
        let x = props.x;
        let y = props.y;

        this.displayClue(props);
        props.hide ? this.displayHiddenCards(props) : this.displayRevealedCards(props);
    }

    displayClue(props) {
      let clueSize = 20;
      let x = props.x;
      let y = props.y - clueSize;

      let fillColor = this.groupRevealed ? CARDCOLORS[this.group] : "#aaaaaa";
      fill(fillColor);
      rect(x, y, CARDSIZE.x, clueSize);

      if (this.numberRevealed) {
        fill(0);
        textSize(20);
        text(this.number, x, y + clueSize);
      }
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

        fill(CARDCOLORS[this.group]);
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
