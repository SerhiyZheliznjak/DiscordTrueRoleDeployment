"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class PingMaster extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Майстер Пінг';
        this.minScore = 100;
        this.msg = 'Нема такого що не можливо виразити пінгом';
    }
    getScore() {
        const pings = this.points.map(p => parseInt(p.val + ''));
        return Math.max(...pings);
    }
    scorePoint(match, player_slot) {
        if (!!match) {
            return DotaParser_1.DotaParser.getPlayerInfo(match, player_slot).pings;
        }
        return 0;
    }
}
exports.PingMaster = PingMaster;
