"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class FirstBloodOwner extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Власнить першу кров';
        this.minScore = 3;
        this.msg = 'Є різні методи то пролити... Вам розказувати чи самі знаєте?';
    }
    getScoreText() {
        return 'Пролито першої крові: ' + this.getScore();
    }
    getScoreDescription() {
        return ' пролити першу кров';
    }
    getThumbURL() {
        return 'https://image.ibb.co/iTHQ0S/First_Blood.jpg';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        if (!player) {
            return 0;
        }
        return !!player && player.firstblood_claimed ? player.firstblood_claimed : 0;
    }
}
exports.FirstBloodOwner = FirstBloodOwner;
