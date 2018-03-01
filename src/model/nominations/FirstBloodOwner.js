"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class FirstBloodOwner extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Володар крові';
        this.minScore = 1;
        this.msg = 'Є різні методи пролити першу кров. Розказувати чи ви самі знаєте?';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        return !!player ? player.firstblood_claimed : null;
    }
}
exports.FirstBloodOwner = FirstBloodOwner;
