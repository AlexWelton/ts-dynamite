import { Gamestate, BotSelection } from '../models/gamestate';

// Chooses the best response based on the opponent's average favoured move thus far
class Bot {
    makeMove(gamestate: Gamestate): BotSelection {
        const baseMoves: BotSelection[] = ['R', 'P' ,'S']

        if (gamestate.rounds.length === 0) {
            return 'D';
        }

        let opponentMoves = {}
        for (const round of gamestate.rounds) {
            opponentMoves[round.p2] = (opponentMoves[round.p2] || 0) + 1;
        }

        const mostCommonOpponentMove: BotSelection = Object.keys(opponentMoves).reduce(
            function(a, b){
                return opponentMoves[a] > opponentMoves[b] ? a : b
            }
        ) as BotSelection;

        let bestResponse: BotSelection
        switch (mostCommonOpponentMove) {
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
