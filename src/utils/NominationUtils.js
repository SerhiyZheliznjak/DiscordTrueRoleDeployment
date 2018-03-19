"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerRecentMatches_1 = require("../model/PlayerRecentMatches");
const Constants_1 = require("../Constants");
class NominationUtils {
    isFreshMatch(recentMatch) {
        const nowInSeconds = new Date().getTime() / 1000;
        return nowInSeconds - recentMatch.start_time < Constants_1.default.MATCH_DUE_TIME_SEC;
    }
    hasNewMatches(freshMatches, storedMatches) {
        let hasNewMatch = false;
        if (this.noMatches(storedMatches)) {
            hasNewMatch = !this.noMatches(freshMatches);
        }
        else {
            if (!this.noMatches(freshMatches)) {
                hasNewMatch = this.freshMatchesNotStored(freshMatches, storedMatches);
            }
        }
        return hasNewMatch;
    }
    noMatches(playerMatches) {
        return !playerMatches || !playerMatches.recentMatchesIds || !playerMatches.recentMatchesIds.length;
    }
    freshMatchesNotStored(freshMatches, storedMatches) {
        const notStored = freshMatches.recentMatchesIds.filter(match_id => storedMatches.recentMatchesIds.indexOf(match_id) < 0);
        return notStored.length > 0;
    }
    getNewMatches(recentMatches, storedMatches) {
        if (this.hasNewMatches(recentMatches, storedMatches)) {
            return recentMatches;
        }
        return new PlayerRecentMatches_1.default(recentMatches.account_id, []);
    }
    isClaimedNomination(newWinner, storedWinner) {
        return !storedWinner || this.isOutOfDueDate(storedWinner)
            || newWinner.nomination.hasHigherScoreThen(storedWinner.nomination);
    }
    isOutOfDueDate(storedWinner) {
        return new Date().getTime() - storedWinner.nomination.timeClaimed >= Constants_1.default.NOMINATION_DUE_INTERVAL;
    }
    getNewRecords(hallOfFame, newResults) {
        const newNominationsClaimed = [];
        for (const nominationName of newResults.keys()) {
            const newWinner = newResults.get(nominationName);
            if (newWinner.account_id !== Constants_1.default.UNCLAIMED && newWinner.nomination.isScored()) {
                const storedWinner = hallOfFame.get(nominationName);
                if (this.isClaimedNomination(newWinner, storedWinner)) {
                    newNominationsClaimed.push(newWinner);
                }
            }
        }
        return newNominationsClaimed;
    }
    getPlayerFullMatches(pfm, match) {
        if (match) {
            pfm.matches.push(match);
        }
        return pfm;
    }
}
exports.default = NominationUtils;
