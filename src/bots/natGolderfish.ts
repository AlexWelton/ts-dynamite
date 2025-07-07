import {BotSelection, Gamestate} from '../models/gamestate';

// Chooses what would beat what would beat its own last move i.e. refuses to lose to Goldfish at all costs
class Bot {
    dynamiteRemaining = 100;
    makeMove(gamestate: Gamestate): BotSelection {

        if (gamestate.rounds.length === 0) {
            return 'D';
        }

        let myLastMove = gamestate.rounds[gamestate.rounds.length - 1].p1;

        let bestOpponentResponse: BotSelection = this.bestResponse(myLastMove);
        return this.bestResponse(bestOpponentResponse);
    }

    bestResponse(opponentMove: BotSelection): BotSelection {
        let bestResponse: BotSelection
        switch (opponentMove) {
            case 'R':
                bestResponse = 'P';
                break;
            case 'P':
                bestResponse = 'S';
                break;
            case 'S':
                bestResponse = 'R';
                break;
            case 'D':
                bestResponse = 'W';
                break;
            case 'W':
                const baseMoves: BotSelection[] = ['R', 'P' ,'S']
                bestResponse = baseMoves[Math.floor(Math.random() * 3)]
                break;
        }
        return bestResponse
    }
}

export = new Bot();
