"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class TacticalFeeder extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Тактичний Фідер';
        this.minScore = 1;
        this.tacticalKDA = [];
    }
    get msg() {
        return 'Мета реально працює\nВмер не менше 10 разів, але виграв матч\n```'
            + this.tacticalKDA.join('\n') + '\n```';
    }
    getScoreText() {
        return 'Виграно матчів фідженням: ' + this.getScore();
    }
    getScoreDescription() {
        return ' виграти матчів безбожно фідячи ворога';
    }
    getThumbURL() {
        return 'https://image.ibb.co/if1o4n/Tactical_Feeder.jpg';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        if (!!player) {
            if (player && player.deaths && player.deaths > 10 && player.win === 1) {
                this.tacticalKDA.push(player.kills + '/' + player.deaths + '/' + player.assists);
                return 1;
            }
            else {
                return 0;
            }
        }
        return 0;
    }
}
exports.TacticalFeeder = TacticalFeeder;
