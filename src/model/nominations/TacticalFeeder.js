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
        this.msg = 'Мета реально працює\nВмер не менше 10 разів, але виграв матч';
    }
    getScoreText() {
        return 'Виграно матчів фідженням: ' + this.getScore();
    }
    getScoreDescription() {
        return ' виграти матчів безбожно фідячи ворога';
    }
    getThumbURL() {
        return 'https://www.dropbox.com/s/x5hm81dy3y2gq0r/TacticalFeeder.png';
    }
    scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
            return player && player.deaths && player.deaths > 10 && player.win === 1 ? 1 : 0;
        }
        return 0;
    }
}
exports.TacticalFeeder = TacticalFeeder;
