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
        return 'Добито веж: ' + this.getScore();
    }
    getScoreDescription() {
        return ' добити веж';
    }
    getThumbURL() {
        return 'https://www.dropbox.com/s/7tijp2qd37enwrf/rapunzel.jpg?dl=0';
    }
    scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
            return player && player.tower_kills > 5 ? player.tower_kills : 0;
        }
        return 0;
    }
}
exports.RapunzelSyndrome = RapunzelSyndrome;
