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
        this.msg = 'Якщо то не Tee Hee то скиньтесь йому по 5 гривень';
    }
    getScore() {
        const apmArr = this.getPoints().map(p => parseInt(p.val + ''));
        return Math.max(...apmArr);
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        return !!player ? player.actions_per_min : null;
    }
}
exports.Parkinson = Parkinson;
