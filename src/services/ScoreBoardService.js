"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nominations_1 = require("../model/Nominations");
const DotaParser_1 = require("./DotaParser");
const NominationResult_1 = require("../model/NominationResult");
class ScoreBoardService {
    constructor() { }
    initNominationResults() {
        return Nominations_1.default.all.reduce((map, nomination) => {
            map.set(nomination.getKey(), []);
            return map;
        }, new Map());
    }
    applyPlayerData(account_id, fullMatches, nominationsResults) {
        this.getPlayerScores(account_id, fullMatches).forEach((nomination) => {
            nominationsResults.get(nomination.getKey()).push(new NominationResult_1.default(account_id, nomination));
        });
    }
    getTopN(n, nominationsResults) {
        const topN = new Map();
        for (const key of nominationsResults.keys()) {
            const sorted = nominationsResults.get(key).sort((a, b) => a.nomination.compare(b.nomination));
            topN.set(key, sorted.slice(0, n));
        }
        return topN;
    }
    getPlayerScores(account_id, fullMatches) {
        return Nominations_1.default.all.map(nomination => {
            fullMatches.forEach(match => nomination.scoreMatch(match, DotaParser_1.DotaParser.getPlayerSlot(match, account_id)));
            return nomination;
        });
    }
}
exports.default = ScoreBoardService;
