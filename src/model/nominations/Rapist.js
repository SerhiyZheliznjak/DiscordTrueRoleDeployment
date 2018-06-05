"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class Rapist extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Рапіст';
        this.minScore = 1;
        this.msg = 'Купив рапіру та переміг';
    }
    getScoreText() {
        return 'Куплено рапір у виграних матчах: ' + this.getScore();
    }
    getScoreDescription() {
        return ' понакупляти рапір та ще й перемогти';
    }
    getThumbURL() {
        return 'https://image.ibb.co/esN9Kx/rapier_winner.png';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            return player && player.purchase_rapier && player.win === 1 ? player.purchase_rapier : 0;
        }
        return 0;
    }
}
exports.Rapist = Rapist;
