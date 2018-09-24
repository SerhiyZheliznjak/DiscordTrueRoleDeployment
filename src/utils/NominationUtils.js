"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerRecentMatches_1 = require("../model/PlayerRecentMatches");
const Constants_1 = require("../Constants");
class NominationUtils {
    hasNewMatches(freshMatches, storedMatches) {
        if (this.noMatches(storedMatches)) {
            return !this.noMatches(freshMatches);
        }
        else {
            if (!this.noMatches(freshMatches)) {
                return freshMatches.recentMatchesIds[0] === storedMatches.recentMatchesIds[0] ? false : true;
            }
        }
        return false;
    }
    getNewMatches(recentMatches, storedMatches) {
        if (this.hasNewMatches(recentMatches, storedMatches)) {
            return recentMatches;
        }
        return new PlayerRecentMatches_1.default(recentMatches.account_id, []);
    }
    isClaimedNomination(newWinner, storedWinner) {
        return this.noStoredWinner(storedWinner)
            || this.isOutOfDueDate(storedWinner)
            || newWinner.nomination.getScore() > storedWinner.score;
    }
    getNewRecords(hallOfFame, newResults) {
        const newNominationsClaimed = [];
        for (const nominationName of newResults.keys()) {
            const newWinner = newResults.get(nominationName);
            if (newWinner.account_id !== Constants_1.default.UNCLAIMED && newWinner.nomination.isScored()) {
                if (this.isClaimedNomination(newWinner, hallOfFame.get(nominationName))) {
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
    noMatches(playerMatches) {
        return !playerMatches || !playerMatches.recentMatchesIds || !playerMatches.recentMatchesIds.length;
    }
    noStoredWinner(storedWinner) {
        return !storedWinner;
    }
    isOutOfDueDate(storedWinner) {
        return new Date().getTime() - storedWinner.timeClaimed >= Constants_1.default.NOMINATION_DUE_INTERVAL;
    }
}
exports.default = NominationUtils;
