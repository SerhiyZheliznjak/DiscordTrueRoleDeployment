"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nominations_1 = require("../model/Nominations");
const DotaParser_1 = require("./DotaParser");
const NominationResult_1 = require("../model/NominationResult");
const Constants_1 = require("../Constants");
class ScoreBoardService {
    constructor() { }
    initNominationResults() {
        return Nominations_1.default.all.reduce((map, nomination) => {
            map.set(nomination.getKey(), [new NominationResult_1.default(Constants_1.default.UNCLAIMED, nomination)]);
            return map;
        }, new Map());
    }
    getPlayerScores(account_id, fullMatches) {
        return Nominations_1.default.all.map(nomination => {
            fullMatches.forEach(match => nomination.scoreMatch(match, DotaParser_1.DotaParser.getPlayerSlot(match, account_id)));
            return nomination;
        });
    }
}
exports.default = ScoreBoardService;
