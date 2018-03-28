"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class ChickeSoupLover extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Збирає на росіл';
        this.minScore = 3;
        this.msg = 'А як ще пояснити нащо йому всі ті кури?';
    }
    getScoreText() {
        return 'Вбито кур\'єрів: ' + this.getScore();
    }
    getScoreDescription() {
        return ' вбити кур\'єрів';
    }
    getThumbURL() {
        return 'https://image.ibb.co/hE8LZn/currier_Killer.jpg';
    }
    scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        return player && player.courier_kills ? player.courier_kills : 0;
    }
}
exports.ChickeSoupLover = ChickeSoupLover;
