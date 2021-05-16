class Board {
    constructor(props) {
        this.deck = [];
        this.clueTokens = 8;
        this.gameStack = {};
        this.discardPile = [];
        GROUPS.forEach((group, index)=> {
            this.gameStack[group] = [];
        })

        this.game = props.game;
    }

    state() {
        return {
            deck: this.deck.map((card)=>card.state()),
            gameStack: this.gameStack,
            discardPile: this.discardPile
        }
    }

    setState(state) {
        this.deck = state.deck.map(cardState => {
            return new Card({
                number: cardState.number,
                group: cardState.group,
                id: cardState.id,
                game: this.game
            })
        });
        this.gameStack = state.gameStack;
        this.discardPile = state.discardPile;
    }

    addToDiscardPile(card) {
        this.discardPile.push(card.state());
    }

    displayDiscardPile(x,y) {

        let tempDiscardPile = JSON.parse(JSON.stringify(this.discardPile));
        // debugger;
            
        GROUPS.forEach((group,i) => {
            BOARD.numbers.forEach( (number,j)=> {

                let card = tempDiscardPile.find((c) => (c.group === group && c.number === number))

                if (card) {
                    fill(CARDCOLORS[group]);
                    textSize(DISCARDPILE.fontSize);
                    text(number,x+j*DISCARDPILE.fontSize, y+i*DISCARDPILE.fontSize*1.5);
                    // debugger;
                    tempDiscardPile = tempDiscardPile.filter((c) => card.id !== c.id);
                    // debugger;
                }

            })
        })
    }

    displayGameBoard(x,y) {
        GROUPS.forEach((group, index)=> {
            fill(CARDCOLORS[group]);
            rect(x , (CARDSIZE.y+10)*index+y, CARDSIZE.x, CARDSIZE.y,CARDSIZE.radius);
            if(this.gameStack[group].length > 0) {
                let displayNumber = this.gameStack[group][this.gameStack[group].length-1];
                //shadow
                fill(COLORS.shadow);
                textSize(CARDSIZE.fontSize);
                text(displayNumber,x+CARDSIZE.padding+5,(CARDSIZE.y+10)*(index+1)+y-CARDSIZE.padding-5);
                //number
                fill(COLORS.white);
                textSize(CARDSIZE.fontSize);
                text(displayNumber,x+CARDSIZE.padding,(CARDSIZE.y+10)*(index+1)+y-CARDSIZE.padding-10);
            }
        })
    }

    checkisValidCard(card) {
        let group = this.gameStack[card.group];
        let lastNumber = group[group.length - 1] || 0;

        return lastNumber === card.number - 1;
    }

    addToGameStack(card) {
        this.gameStack[card.group].push(card.number);
    }

    playCard(card) {
        if(this.checkisValidCard(card)) {
            this.addToGameStack(card);
            return true;
        } else {
            this.addToDiscardPile(card);
            return false;
        }
    }
}
