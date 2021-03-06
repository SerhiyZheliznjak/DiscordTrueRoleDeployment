"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class TeamFighter extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Командний Боєць';
        this.minScore = 50;
        this.msg = 'Найвищий середній показник участі в командних бійках';
    }
    getScore() {
        const pointsSum = this.getPoints().reduce((sum, p) => sum + (+p[1] * 100), 0);
        return Math.round(pointsSum / this.getPoints().length);
    }
    getScoreText() {
        return 'Відсоток участі: ' + this.getScore();
    }
    getScoreDescription() {
        return ' приймати участь у командних бійках';
    }
    getThumbURL() {
        return 'https://image.ibb.co/kNZuun/Team_Fighterlogo_square.png';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        if (!player) {
            return 0;
        }
        return player && player.teamfight_participation ? player.teamfight_participation : 0;
    }
}
exports.TeamFighter = TeamFighter;
