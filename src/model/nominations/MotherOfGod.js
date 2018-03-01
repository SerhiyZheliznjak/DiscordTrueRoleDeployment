"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class MotherOfGod extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Матка Бозька';
        this.minScore = 10;
        this.msg = 'Я лічно не вірю що це хтось досягне';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        return !!player && player.deaths === 0 ? 1 : 0;
    }
}
exports.MotherOfGod = MotherOfGod;
