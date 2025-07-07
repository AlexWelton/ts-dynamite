import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {

    private enemDynRem : number;
    private dynRem : number;

    private moveMap : Map<BotSelection, number>;

    public constructor() {
        this.enemDynRem = 100;
        this.dynRem = 100;

        this.moveMap = new Map();

        this.moveMap.set("D",0.2);
        this.moveMap.set("R",0.2);
        this.moveMap.set("P",0.2);
        this.moveMap.set("S",0.2);
        this.moveMap.set("W",0.2);

    }

    private getRandomMove() : BotSelection {
        let random = Math.random();
        let moveIndex = 0;
        let keys = Array.from(this.moveMap.keys());

        let move : BotSelection = "D";
        console.log("");
        console.log(random);
        while (random > 0) {
            move = keys[moveIndex];
            console.log(move);
            random -= this.moveMap.get(keys[moveIndex]);
            console.log(random);
            moveIndex++;
        }

        return move;
    }

    private setMoveChance(changedMove : BotSelection, newChance : number) : void {
        console.log("\nChanging Chances");
        console.log(this.moveMap);
        let oldChance = this.moveMap.get(changedMove);
        let dChance = newChance - oldChance;

        this.moveMap.set(changedMove, newChance);

        let newDenom = 1 + dChance; //Calculate denominator to divide other chances by

        for (let move of this.moveMap.keys()) {
            if (move != changedMove) {
                this.moveMap.set(move, this.moveMap.get(move) / newDenom); // Adjust chance proportionally based on new denominator
            }
        }


        console.log(this.moveMap);
        console.log("\n");
    }

    makeMove(gamestate: Gamestate): BotSelection {
        let prevRound = gamestate.rounds[gamestate.rounds.length - 1];

        if (prevRound != undefined) {
            console.log (prevRound.p1 + " - " + prevRound.p2);
            if (prevRound.p2 == "D") {
                this.enemDynRem--;
                if (this.enemDynRem <= 0) {
                    this.setMoveChance("W",0);
                }
            }

            if (prevRound.p1 == "D") {
                this.dynRem--;
                if (this.dynRem <= 0) {
                    this.setMoveChance("D",0);
                }
            }
        }

        let move = this.getRandomMove();

        return move;
    }
}

export = new Bot();
