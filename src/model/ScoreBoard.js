"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScoreBoardService_1 = require("../services/ScoreBoardService");
class ScoreBoard {
    constructor(scoreBoardService = new ScoreBoardService_1.default()) {
        this.scoreBoardService = scoreBoardService;
        this.nominationsResults = this.scoreBoardService.initNominationResults();
    }
    scorePlayer(account_id, fullMatches) {
        this.scoreBoardService.applyPlayerData(account_id, fullMatches, this.nominationsResults);
    }
    getFirstPlaces() {
        const winners = new Map();
        for (const nominationKey of this.nominationsResults.keys()) {
            const sortedResults = this.nominationsResults.get(nominationKey).sort((a, b) => a.nomination.compare(b.nomination));
            winners.set(nominationKey, sortedResults[0]);
        }
        return winners;
    }
    getTopN(n) {
        return this.scoreBoardService.getTopN(n, this.nominationsResults);
    }
}
exports.default = ScoreBoard;
