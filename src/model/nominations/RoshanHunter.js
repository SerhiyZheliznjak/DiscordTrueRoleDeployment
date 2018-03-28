"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class RoshanHunter extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Рошан-хуян';
        this.minScore = 3;
        this.msg = 'Не такий страшний Рошан як його малюють';
    }
    getScoreText() {
        return 'Вбито Рошанів: ' + this.getScore();
    }
    getScoreDescription() {
        return ' вбити рошанів';
    }
    getThumbURL() {
        return 'https://image.ibb.co/i8JLZn/Roshan.jpg';
    }
    scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        return player && player.roshan_kills ? player.roshan_kills : 0;
    }
}
exports.RoshanHunter = RoshanHunter;
