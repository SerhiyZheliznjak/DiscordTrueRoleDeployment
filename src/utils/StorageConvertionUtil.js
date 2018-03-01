"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerRecentMatchesJson_1 = require("../model/json/PlayerRecentMatchesJson");
const NominationResult_1 = require("../model/NominationResult");
const NominationResultJson_1 = require("../model/json/NominationResultJson");
const NominationFactory_1 = require("../services/NominationFactory");
const Constants_1 = require("../Constants");
class StorageConvertionUtil {
    static convertToRecentMatchJson(account_id, matches) {
        return new PlayerRecentMatchesJson_1.default(account_id, matches);
    }
    static convertToPlayersRecentMatchesMap(recentMatches) {
        return recentMatches.reduce((map, rmj) => {
            map.set(rmj.account_id, rmj.recentMatchesIds);
            return map;
        }, new Map());
    }
    static convertToNominationResultJson(nominationResult) {
        return new NominationResultJson_1.default(nominationResult.nomination.getName(), nominationResult.account_id, nominationResult.nomination.getScore(), new Date().getTime());
    }
    static convertToWonNominations(nominationsWinnersJson) {
        return nominationsWinnersJson.reduce((map, nwj) => {
            const nomination = NominationFactory_1.default.createByName(nwj.nominationName);
            nomination.addPoint(Constants_1.default.WINNING_MATCH_ID, nwj.score);
            nomination.timeClaimed = nwj.timeClaimed;
            const nw = new NominationResult_1.default(nwj.owner_account_id, nomination);
            map.set(nwj.nominationName, nw);
            return map;
        }, new Map());
    }
    static convertToPlayerObserved(playersPairs) {
        return playersPairs.reduce((map, pair) => {
            map.set(pair.p1, pair.p2);
            return map;
        }, new Map());
    }
}
exports.default = StorageConvertionUtil;
