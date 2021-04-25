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
            return new Card({
                number: cardState.number,
                group: cardState.group,
                numberRevealed: cardState.numberRevealed,
                groupRevealed: cardState.groupRevealed,
                id: cardState.id,
                game: this.game,
                player: this
            })
        });
    }

    removeCard(card) {
        this.cards.splice(this.cards.findIndex((handCard) => handCard.id === card.id), 1);
    }

    display(props) {
        for(let i=0;i<this.cards.length;i++) {
            this.cards[i].display({x:props.x + i * (CARDSIZE.x +20), y:props.y, hide:props.hide});
        }
    }
}
