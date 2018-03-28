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
        const pointsSum = this.getPoints().reduce((sum, p) => sum + (+p.p2 * 100), 0);
        return Math.round(pointsSum / this.getPoints().length);
    }
    getScoreText() {
        return 'Відсоток участі: ' + this.getScore();
    }
    getScoreDescription() {
        return ' приймати участь у командних бійках ';
    }
    getThumbURL() {
        return 'https://d1u5p3l4wpay3k.cloudfront.net/lolesports_gamepedia_en/7/76/Team_Fighterlogo_square.png';
    }
    scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        return player && player.teamfight_participation ? player.teamfight_participation : 0;
    }
}
exports.TeamFighter = TeamFighter;
