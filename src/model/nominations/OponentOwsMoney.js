"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class OponentOwsMoney extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Не вбий суперника свого';
        this.minScore = 3;
        this.msg = 'Суперник гроші винен\n0 вбивств у 3х чи більше матчах';
    }
    getScoreText() {
        return 'Матчів без вбивств: ' + this.getScore();
    }
    getScoreDescription() {
        return ' не вбити жодного суперника';
    }
    getThumbURL() {
        return 'https://image.ibb.co/kXpSEn/Opponent_Owns_Money.jpg';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return !!player && player.kills === 0 ? 1 : 0;
        }
        return 0;
    }
}
exports.OponentOwsMoney = OponentOwsMoney;
