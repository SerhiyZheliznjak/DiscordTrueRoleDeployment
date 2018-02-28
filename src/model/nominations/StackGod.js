"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class StackGod extends Nomination_1.Nomination {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Скиртувальник 1го розряду';
        this.minScore = 20;
        this.msg = 'То певно той що джунглі персувати помагав';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        return !!player && player.camps_stacked;
    }
}
exports.StackGod = StackGod;
