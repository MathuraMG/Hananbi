class Player {
    constructor(id, game) {
        this.id = id;
        this.game = game;
        this.cards = [];
        this.noCards = 5;
    }

    state() {
        return {
            id: this.id,
            cards: this.cards.map((card)=> card.state())
        }
    }

    setState(state) {
        this.id = state.id,
        this.cards = state.cards.map(cardState => {
            return new Card(
                cardState.number,
                cardState.group,
                cardState.id,
                this.game,
                this
            )
        });
    }

    removeCard(card) {
        this.cards.splice(this.cards.findIndex((handCard) => handCard.id === card.id), 1);
    }

    display(x, y, canReveal) {
        for(let i=0;i<this.cards.length;i++) {
            this.cards[i].display(x + i * (CARDSIZE.x +20), y, canReveal); 
        }
    }
}
