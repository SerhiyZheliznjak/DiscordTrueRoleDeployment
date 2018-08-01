"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class RapunzelSyndrome extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Синдром Рапунзель';
        this.minScore = 1;
        this.msg = 'Нахєр вежі!\nДобив 5 або більше веж за матч';
    }
    getScoreText() {
        return 'Добито більше 5ти веж за матч: ' + this.getScore();
    }
    getScoreDescription() {
        return ' добити більше 5ти веж';
    }
    getThumbURL() {
        return 'https://image.ibb.co/fA4uun/rapunzel.jpg';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return player && player.tower_kills > 5 ? 1 : 0;
        }
        return 0;
    }
}
exports.RapunzelSyndrome = RapunzelSyndrome;
