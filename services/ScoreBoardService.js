"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nominations_1 = require("../model/Nominations");
const DotaParser_1 = require("./DotaParser");
const NominationWinner_1 = require("../model/NominationWinner");
const Constants_1 = require("../Constants");
class ScoreBoardService {
    constructor() { }
    initNominationWinners() {
        return Nominations_1.default.all.reduce((map, nomination) => {
            map.set(nomination.getName(), new NominationWinner_1.default(Constants_1.Constants.UNCLAIMED, nomination));
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
//# sourceMappingURL=ScoreBoardService.js.map