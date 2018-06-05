"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class Parkinson extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Паркінсон';
        this.minScore = 100;
        this.msg = 'Як крілик, бо не факт що крілики каждий раз попадають там де цілились\n'
            + 'Найбільше дій за хвилину у одному з матчів';
    }
    getScoreText() {
        return 'Дій за хвилину: ' + this.getScore();
    }
    getScore() {
        const apmArr = this.getPoints().map(p => parseInt(p.p2 + ''));
        return Math.max(...apmArr);
    }
    getScoreDescription() {
        return ' понацикувати за хвилину';
    }
    getThumbURL() {
        return 'https://image.ibb.co/jFR7En/parkinson.jpg';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return !!player && player.actions_per_min ? player.actions_per_min : 0;
        }
        return 0;
    }
}
exports.Parkinson = Parkinson;
