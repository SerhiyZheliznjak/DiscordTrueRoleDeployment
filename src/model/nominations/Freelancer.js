"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class Freelancer extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Хан Соло';
        this.minScore = 10;
        this.msg = 'Соло ММР всім ММРам ММР';
    }
    getScoreText() {
        return 'Зіграно соло матчів: ' + this.getScore();
    }
    getScoreDescription() {
        return ' зіграти в соляру';
    }
    getThumbURL() {
        return 'https://image.ibb.co/h523n7/Pacifist.jpg';
    }
    scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        return player && player.party_size && player.party_size === 1 ? 1 : 0;
    }
}
exports.Freelancer = Freelancer;
