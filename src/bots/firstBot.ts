import { Gamestate, BotSelection } from '../models/gamestate';

type Round = {
    p1: BotSelection,
    p2: BotSelection,
}


type HighStakesChoice = "RPS" | "D" | "W";

class Bot {

    private enemDynRem : number;
    private enemHasDyn : boolean;

    private dynRem : number;
    private haveDyn : boolean;

    private currentStakes : number;

    private moveMap : Map<BotSelection, number>;
    private highStakesMoves : Map<HighStakesChoice, number>;

    private highStakesBoundary : number;

    public constructor() {
        this.enemDynRem = 100;
        this.enemHasDyn = true;

        this.dynRem = 100;
        this.haveDyn = true;

        this.currentStakes = 1;
        this.highStakesBoundary = 2;

        this.moveMap = new Map();

        this.moveMap.set("D",1);
        this.moveMap.set("R",5);
        this.moveMap.set("P",5);
        this.moveMap.set("S",5);
        this.moveMap.set("W",1);

        this.highStakesMoves = new Map();
        this.highStakesMoves.set("D",3);
        this.highStakesMoves.set("RPS", 2);
        this.highStakesMoves.set("W",1);

    }



    private adjustMoveChance(changedMove : BotSelection, increment : number) : void {
        if (increment == 0) return;
        //console.log("\nChanging Chances");
        //console.log(this.moveMap);
        if (increment < 0) {
            for (let [otherMove, chance] of this.moveMap.entries()) {
                let total = this.getMapTotal(this.moveMap);
                if (otherMove != changedMove && (otherMove != "D" || this.haveDyn)) {
                    let weightedIncrement = Math.round((this.moveMap.get(otherMove) / total) * increment * -1);
                    this.moveMap.set(otherMove, chance + weightedIncrement);
                }
            }
        }
        else {
            this.moveMap.set(changedMove, this.moveMap.get(changedMove) + increment);
        }

        //console.log(this.moveMap);
        //console.log("\n");
    }

    private checkDynamite() {
        this.dynRem--;
        if (this.dynRem <= 0) {
            this.haveDyn = false;
            this.moveMap.set("D", 0);
            this.highStakesMoves.set("D",0);
        }
    }

    private checkEnemDynamite() {
        this.enemDynRem--;
        if (this.enemDynRem <= 0) {
            this.enemHasDyn = false;
            this.moveMap.set("W", 0);
            this.highStakesMoves.set("W",0);
        }
    }

    private adjustForPastMove(prevRound : Round) {

        let myMove = prevRound.p1;
        let enemMove = prevRound.p2;

        let winner = this.getWinner(prevRound);

        switch(enemMove) {
            case "D":
                if (winner == -1) this.adjustMoveChance("W", 1);
                break;
            case "R":
                if (winner == -1) this.adjustMoveChance("P", 1);
                break;
            case "P":
                if (winner == -1) this.adjustMoveChance("S", 1);
                break;
            case "S":
                if (winner == -1) this.adjustMoveChance("R", 1);
                break;
            case "W":
                this.adjustMoveChance("D", -2);
                break;
        }
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

    private updateStakes(prevRound : Round) {
        let wasDraw = this.getWinner(prevRound) == 0;

        if (wasDraw) this.currentStakes++;
        else this.currentStakes = 1;
    }

    private getMapTotal(map: Map<any,number>) {
        return Array.from(map.values()).reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0,
        );
    }

    private getRandomChoiceFromMap(map : Map<any, number>) : any {
        //console.log(map);
        let total = this.getMapTotal(map);
        let random = Math.floor(Math.random() * (total-1)) + 1;
        let index = 0;
        let keys = Array.from(map.keys());

        let choice = undefined;
        //console.log("");
        //console.log(random);
        do {
            choice = keys[index];
            //console.log(choice);
            random -= map.get(keys[index]);
            //console.log(random);
            index++;
        }
        while (random > 0);

        return choice;
    }

    private getRPSMove() {
        let rpsMap = new Map(this.moveMap);
        rpsMap.set("D", 0);
        rpsMap.set("W", 0);
        return this.getRandomChoiceFromMap(rpsMap);
    }

    private getRandomMove() : BotSelection {
        return this.getRandomChoiceFromMap(this.moveMap);
    }

    private updateHighStakesChoices(prevRound: Round) {
        let enemMove = prevRound.p1;
        let winner = this.getWinner(prevRound);
        switch(enemMove) {
            case "D":
                if (winner == -1) {
                    if (this.enemHasDyn) this.highStakesMoves.set("W", this.highStakesMoves.get("W") + 2);
                    this.highStakesMoves.set("RPS", Math.max(0,this.highStakesMoves.get("RPS") - 1));
                }
                break;
            case "R":
            case "P":
            case "S":
                if (winner == -1) {
                    if (this.haveDyn) this.highStakesMoves.set("D", this.highStakesMoves.get("D") + 1);
                    this.highStakesMoves.set("W", Math.max(0,this.highStakesMoves.get("W") - 1));
                }
                break;
            case "W":
                if (winner == -1) {
                    this.highStakesMoves.set("RPS", this.highStakesMoves.get("RPS") + 1);
                    this.highStakesMoves.set("D", Math.max(0,this.highStakesMoves.get("D") - 1));
                }
                break;
        }

    }

    private getHighStakesMove() {
        let move : HighStakesChoice = this.getRandomChoiceFromMap(this.highStakesMoves);
        //console.log(move);
        if (move == "RPS") return this.getRPSMove();
        else return move;
    }

    makeMove(gamestate: Gamestate): BotSelection {
        //console.log("\n\n NEW MOVE");
        let prevRound = gamestate.rounds[gamestate.rounds.length - 1];

        if (prevRound != undefined) {
            //console.log (prevRound.p1 + " - " + prevRound.p2);

            if (prevRound.p2 == "D") this.checkEnemDynamite();
            if (prevRound.p1 == "D") this.checkDynamite();

            //console.log(this.haveDyn);

            if (this.currentStakes >= this.highStakesBoundary) this.updateHighStakesChoices(prevRound);

            this.updateStakes(prevRound);


            this.adjustForPastMove(prevRound);

        }

        let move = this.currentStakes >= this.highStakesBoundary ? this.getHighStakesMove() : this.getRandomMove();

        //console.log(move);
        return move;
    }
}

export = new Bot();
