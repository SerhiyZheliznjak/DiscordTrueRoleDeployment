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
        return ' протримати ворогів у приголомшенні';
    }
    getThumbURL() {
        return 'https://image.ibb.co/fTpin7/stunner.png';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return player && player.stuns ? player.stuns : 0;
        }
        return 0;
    }
}
exports.StunningMan = StunningMan;
