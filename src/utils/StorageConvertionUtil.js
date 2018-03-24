"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerRecentMatchesJson_1 = require("../model/json/PlayerRecentMatchesJson");
const NominationResultJson_1 = require("../model/json/NominationResultJson");
const PlayerRecentMatches_1 = require("../model/PlayerRecentMatches");
class StorageConvertionUtil {
    static convertToRecentMatchJson(account_id, matches) {
        return new PlayerRecentMatchesJson_1.default(account_id, matches);
    }
    static convertToPlayersRecentMatches(recentMatches) {
        if (recentMatches) {
            return new PlayerRecentMatches_1.default(recentMatches.account_id, recentMatches.recentMatchesIds);
        }
        return new PlayerRecentMatches_1.default(0, []);
    }
    static convertToNominationResultJson(nominationResult) {
        return new NominationResultJson_1.default(nominationResult.nomination.getKey(), nominationResult.nomination.getName(), nominationResult.account_id, nominationResult.nomination.getScore(), nominationResult.nomination.timeClaimed);
    }
    static convertToWonNominations(hallOfFame) {
        return hallOfFame.reduce((map, nwj) => {
            if (this.isValidNominationResult(nwj)) {
                map.set(nwj.key, nwj);
            }
            else {
                console.error('Corrupted nomination result ', nwj);
            }
            return map;
        }, new Map());
    }
    static convertToPlayerObserved(registeredPlayersJson) {
        return registeredPlayersJson.reduce((map, registeredPlayer) => {
            if (registeredPlayer.account_id && registeredPlayer.discordId) {
                map.set(registeredPlayer.account_id, registeredPlayer.discordId);
            }
            else {
                console.error('Corrupted Registered Player ', registeredPlayer);
            }
            return map;
        }, new Map());
    }
    static isValidNominationResult(nrj) {
        return this.isDefined(nrj.nominationName)
            && this.isDefined(nrj.owner_account_id)
            && this.isDefined(nrj.score)
            && this.isDefined(nrj.timeClaimed);
    }
    static isDefined(val) {
        return val !== undefined && val !== null;
    }
}
exports.default = StorageConvertionUtil;
