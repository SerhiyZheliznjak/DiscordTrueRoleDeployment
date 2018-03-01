"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class MotherOfGod extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Хуй Замочиш';
        this.minScore = 3;
        this.msg = 'Мабуть то ліпше ніж Ісус? \n Ну бо нащо вміти воскресати за 3 дні, якщо тебе хрін замочиш?';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        return !!player && player.deaths === 0 ? 1 : 0;
    }
}
exports.MotherOfGod = MotherOfGod;
