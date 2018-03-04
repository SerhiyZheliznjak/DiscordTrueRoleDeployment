"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ScoreBoardService_1 = require("../services/ScoreBoardService");
class ScoreBoard {
    constructor(scoreBoardService = new ScoreBoardService_1.default()) {
        this.scoreBoardService = scoreBoardService;
        this.nominationsResults = this.scoreBoardService.initNominationResults();
    }
    scorePlayer(account_id, fullMatches) {
        this.applyPlayerScores(account_id, this.scoreBoardService.getPlayerScores(account_id, fullMatches));
    }
    applyPlayerScores(account_id, nominations) {
        nominations.forEach(challengerNominationResult => {
            const bestResultSoFar = this.nominationsResults.get(challengerNominationResult.getName());
            if (challengerNominationResult.hasHigherScoreThen(bestResultSoFar.nomination)) {
                bestResultSoFar.account_id = account_id;
                bestResultSoFar.nomination = challengerNominationResult;
            }
        });
    }
}
exports.default = ScoreBoard;
