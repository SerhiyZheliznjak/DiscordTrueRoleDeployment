"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NominationResult_1 = require("./NominationResult");
const ScoreBoardService_1 = require("../services/ScoreBoardService");
class ScoreBoard {
    constructor(scoreBoardService = new ScoreBoardService_1.default()) {
        this.scoreBoardService = scoreBoardService;
        this.nominationsResults = this.scoreBoardService.initNominationResults();
    }
    scorePlayer(account_id, fullMatches) {
        this.applyPlayerScores(account_id, this.scoreBoardService.getPlayerScores(account_id, fullMatches));
    }
    getFirstPlaces() {
        const winners = new Map();
        for (const nominationKey of this.nominationsResults.keys()) {
            const sortedResults = this.nominationsResults.get(nominationKey).sort((a, b) => a.nomination.compare(b.nomination));
            winners.set(nominationKey, sortedResults[0]);
        }
        return winners;
    }
    getSortedNominationResults() {
        for (const nr of this.nominationsResults.values()) {
            nr.sort((a, b) => a.nomination.compare(b));
        }
        return this.nominationsResults;
    }
    applyPlayerScores(account_id, nominations) {
        nominations.forEach((nominationResult) => {
            this.nominationsResults.get(nominationResult.getKey()).push(new NominationResult_1.default(account_id, nominationResult));
        });
    }
}
exports.default = ScoreBoard;
