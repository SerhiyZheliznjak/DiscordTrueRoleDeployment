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
        return ' пролити першої крові ';
    }
    getThumbURL() {
        return 'http://is4.mzstatic.com/image/thumb/Video4/v4/ed/11/4d/ed114d74-8312-6fbc-072c-d1f8ac576743/source/227x227bb.jpg';
    }
    scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        return !!player && player.firstblood_claimed ? player.firstblood_claimed : 0;
    }
}
exports.FirstBloodOwner = FirstBloodOwner;
