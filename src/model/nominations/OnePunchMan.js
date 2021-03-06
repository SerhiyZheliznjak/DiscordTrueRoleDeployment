"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
const Constants_1 = require("../../Constants");
const util_1 = require("util");
class OnePunchMan extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Вірастюк';
        this.minScore = Constants_1.default.AM_HP;
        this.msg = 'Йобне раз, але сильно. Вбив %s антимагів одиним ударом!';
    }
    getScoreText() {
        return 'Шкоди за удар: ' + this.getScore();
    }
    getScoreDescription() {
        return ' гепнути за раз';
    }
    getThumbURL() {
        return 'https://image.ibb.co/i4SsfS/one_Punch_Man.jpg';
    }
    getScore() {
        const dmgArr = this.getPoints().map(p => parseInt(p[1] + ''));
        return Math.max(...dmgArr);
    }
    getMessage() {
        return util_1.format(this.msg, this.roundToTwoDec(this.getScore() / Constants_1.default.AM_HP));
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return !!player && !!player.max_hero_hit && !!player.max_hero_hit.value ? player.max_hero_hit.value : 0;
        }
        return 0;
    }
    roundToTwoDec(num) {
        return Math.round(num * 100) / 100;
    }
}
exports.OnePunchMan = OnePunchMan;
