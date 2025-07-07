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
        if (newChance < 0) newChance = 0;
        let dChance = newChance - oldChance;

        this.moveMap.set(changedMove, newChance);

        let newTotal = Array.from(this.moveMap.values()).reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0,
        );


        for (let move of this.moveMap.keys()) {
            let adjustedChance = this.moveMap.get(move) / newTotal;
            this.moveMap.set(move,adjustedChance);
        }


        console.log(this.moveMap);
        console.log("\n");
    }

    private checkDynamite() {
        this.dynRem--;
        if (this.dynRem <= 0) {
            this.haveDyn = false;
            this.setMoveChance("D",0);
        }
    }

    private checkEnemDynamite() {
        this.enemDynRem--;
        if (this.enemDynRem <= 0) {
            this.enemHasDyn = false;
            this.setMoveChance("W",0);
        }
    }

    private adjustForPastMove(prevRound : Round) {

        let myMove = prevRound.p1;
        let moveChance = this.moveMap.get(myMove);

        let winner = this.getWinner(prevRound);
        console.log(winner);
        if (winner == 1 && moveChance < 0.95) this.setMoveChance(myMove, moveChance + 0.05);
        else if (winner == -1) this.setMoveChance(myMove, moveChance - 0.05);
    }

    private getWinner(prevRound : Round) : number {
        let enemMove = prevRound.p2;
        let myMove = prevRound.p1;

        if (enemMove == myMove) return 0;

        switch (myMove) {
            case "D":
                return enemMove == "W" ? -1 : 1;
            case "R":
                return (enemMove == "D" || enemMove == "P") ? -1 : 1;
            case "P":
                return (enemMove == "D" || enemMove == "S") ? -1 : 1;
            case "S":
                return (enemMove == "D" || enemMove == "R") ? -1 : 1;
            case "W":
                return (enemMove != "D") ? -1 : 1;
        }
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

            this.updateStakes(prevRound);

            this.adjustTempModifiers(prevRound);

            this.adjustForPastMove(prevRound);
        }

        let move = this.getRandomMove();

        return move;
    }
}

export = new Bot();
