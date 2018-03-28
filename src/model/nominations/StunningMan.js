"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class StunningMan extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Гупало Василь';
        this.minScore = 100;
        this.msg = 'Він такий приголомшливий!\nНайдовше часу протримав суперників приголомшеними';
    }
    getScoreText() {
        return 'Протримав ворогів у приголомшені: ' + this.getScore() + 'сек';
    }
    getScoreDescription() {
        return ' протримати ворогів у приголомшенні ';
    }
    getThumbURL() {
        return 'https://www.dropbox.com/s/7hp4kz65g51r1nt/stunner.png?dl=0';
    }
    scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
            return player && player.stuns ? player.stuns : 0;
        }
        return 0;
    }
}
exports.StunningMan = StunningMan;
