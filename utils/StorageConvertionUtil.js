"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerRecentMatchesJson_1 = require("../model/json/PlayerRecentMatchesJson");
const NominationWinner_1 = require("../model/NominationWinner");
const NominationWinnerJson_1 = require("../model/json/NominationWinnerJson");
const NominationFactory_1 = require("../services/NominationFactory");
const Constants_1 = require("../Constants");
const Pair_1 = require("../model/Pair");
class StorageConvertionUtil {
    static convertToRecentMatchJson(recentMatches) {
        const recentPlayerMatches = [];
        for (const pair of recentMatches.entries()) {
            recentPlayerMatches.push(new PlayerRecentMatchesJson_1.default(pair[0], pair[1]));
        }
        return recentPlayerMatches;
    }
    static convertToPlayerRecentMatches(recentMatches) {
        return recentMatches.reduce((map, rmj) => {
            map.set(rmj.account_id, rmj.recentMatchesIds);
            return map;
        }, new Map());
    }
    static convertToNominationWinnersJson(nominationsWinners) {
        const nominationWinnersJson = [];
        for (const nw of nominationsWinners.values()) {
            nominationWinnersJson.push(new NominationWinnerJson_1.default(nw.nomination.getName(), nw.account_id, nw.nomination.getScore()));
        }
        return nominationWinnersJson;
    }
    static convertToWonNominations(nominationsWinnersJson) {
        return nominationsWinnersJson.reduce((map, nwj) => {
            const nomination = NominationFactory_1.default.createByName(nwj.nominationName);
            nomination.addPoint(Constants_1.Constants.WINNING_MATCH_ID, nwj.score);
            const nw = new NominationWinner_1.default(nwj.owner_account_id, nomination);
            map.set(nwj.nominationName, nw);
            return map;
        }, new Map());
    }
    static convertToPlayersPairs(playerObserved) {
        const pairs = [];
        for (const account_id of playerObserved.keys()) {
            pairs.push(new Pair_1.default(account_id, playerObserved.get(account_id)));
        }
        return pairs;
    }
    static convertToPlayerObserved(playersPairs) {
        return playersPairs.reduce((map, pair) => {
            map.set(pair.key, pair.val);
            return map;
        }, new Map());
    }
}
exports.default = StorageConvertionUtil;
//# sourceMappingURL=StorageConvertionUtil.js.map