import {BotSelection, Gamestate} from '../models/gamestate';

// Chooses a random R, P, S (or D if available)
class Bot {
    dynamiteRemaining = 100;
    makeMove(gamestate: Gamestate): BotSelection {
        const baseMoves: BotSelection[] = ['R', 'P' ,'S']
        if (this.dynamiteRemaining > 0) {
            baseMoves.push('D');
        }

        const selection = baseMoves[Math.floor(Math.random() * baseMoves.length)];

        if (selection === 'D') {
            this.dynamiteRemaining -= 1;
        }

        return selection;
    }
}

export = new Bot();
