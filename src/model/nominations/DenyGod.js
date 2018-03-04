"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class DenyGod extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Заперечувач';
        this.minScore = 10;
        this.msg = 'Сам не гам і ворогу не дам!';
    }
    getScore() {
        const denyArr = this.getPoints().map(p => parseInt(p.p2 + ''));
        return Math.max(...denyArr);
    }
    scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        return player && player.denies ? player.denies : 0;
    }
}
exports.DenyGod = DenyGod;
