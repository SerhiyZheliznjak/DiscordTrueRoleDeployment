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
        this.msg = 'Як крілик, бо не факт що крілики каждий раз попадають там де цілились.\n Якщо крілики взагалі вміють цілитись...';
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
