class Board {
    constructor() {
        this.deck = [];
        this.clueTokens = 8;
        this.gameStack = {};
        this.discardPile = [];
        GROUPS.forEach((group, index)=> {
            this.gameStack[group] = [];
        })
        
    }

    state() {
        return {
            deck: this.deck.map((card)=>card.state()),
            gameStack: this.gameStack,
            discardPile: this.discardPile
        }
    }

    addToDiscardPile(card) {
        this.discardPile.push(card.state());
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
        } else {
            this.addToDiscardPile(card);
        }
    }
}