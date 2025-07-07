import {BotSelection, Gamestate} from '../models/gamestate';

// Chooses what would have won the previous round
class Bot {
    dynamiteRemaining = 100;
    makeMove(gamestate: Gamestate): BotSelection {
        const baseMoves: BotSelection[] = ['R', 'P' ,'S']

        if (gamestate.rounds.length === 0) {
            return 'D';
        }

        let lastOpponentMove = gamestate.rounds[gamestate.rounds.length - 1].p2;

        let bestResponse: BotSelection
        switch (lastOpponentMove) {
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
                bestResponse = baseMoves[Math.floor(Math.random() * 3)]
        }

        return bestResponse
    }
}

export = new Bot();
