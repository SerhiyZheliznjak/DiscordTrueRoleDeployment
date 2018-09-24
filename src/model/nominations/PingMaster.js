"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class PingMaster extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Майстер Пінг';
        this.minScore = 50;
        this.msg = 'Мабуть, він вірить в силу пінга, а також телекінез, магію і Святого Миколая\n'
            + 'Напінгав 50 і більше разів у матчі';
    }
    getScoreText() {
        return 'Кількість пінгів: ' + this.getScore();
    }
    getScoreDescription() {
        return ' напінгати';
    }
    getScore() {
        const pings = this.points.map(p => parseInt(p[1] + ''));
        return Math.max(...pings);
    }
    getThumbURL() {
        return 'https://image.ibb.co/id89S7/Master_Ping.jpg';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return player && player.pings ? player.pings : 0;
        }
        return 0;
    }
}
exports.PingMaster = PingMaster;
