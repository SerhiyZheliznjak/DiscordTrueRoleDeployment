"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class OponentOwsMoney extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Не вбий суперника свого';
        this.minScore = 5;
        this.msg = 'Суперник гроші винен';
    }
    scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
            return !!player && player.kills === 0 ? 1 : 0;
        }
        return 0;
    }
}
exports.OponentOwsMoney = OponentOwsMoney;
