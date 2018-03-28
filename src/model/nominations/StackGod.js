"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class StackGod extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Скиртувальник 1го розряду';
        this.minScore = 20;
        this.msg = 'То певно той що джунглі персувати помагав\nНайбільша кількість скирт';
    }
    getScoreText() {
        return 'Наскиртовано таборів: ' + this.getScore();
    }
    getScoreDescription() {
        return ' наскиртувати таборів';
    }
    getThumbURL() {
        return 'https://image.ibb.co/fKKSEn/Stack.jpg';
    }
    scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
            return !!player && player.camps_stacked ? player.camps_stacked : 0;
        }
        return 0;
    }
}
exports.StackGod = StackGod;
