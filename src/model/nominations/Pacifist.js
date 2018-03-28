"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class Pacifist extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Пацифіст';
        this.minScore = 60;
        this.msg = 'Найнижча участь у командних бійках';
    }
    getScore() {
        const pointsSum = this.getPoints().reduce((sum, p) => sum + (+p.p2 * 100), 0);
        return Math.round(pointsSum / this.getPoints().length);
    }
    getScoreText() {
        return 'Відсоток участі: ' + (100 - this.getScore());
    }
    getScoreDescription() {
        return ' приймати участь у командних бійках';
    }
    getThumbURL() {
        return 'https://image.ibb.co/nqS3n7/hippie.jpg';
    }
    scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        return player && player.teamfight_participation ? 1 - player.teamfight_participation : 0;
    }
}
exports.Pacifist = Pacifist;
