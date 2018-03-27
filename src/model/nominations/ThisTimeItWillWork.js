"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class ThisTimeItWillWork extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Шяс піде';
        this.minScore = 5;
        this.msg = 'То не просто так в народі кажуть - складай на байбек з молоду\nБайбекнувся і виграв';
    }
    getScoreText() {
        return 'Сума викупів у виграних матчах: ' + this.getScore();
    }
    getScoreDescription() {
        return ' викупитись і виграти ';
    }
    scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
            return player && player.buyback_count && player.win === 1 ? player.buyback_count : 0;
        }
        return 0;
    }
}
exports.ThisTimeItWillWork = ThisTimeItWillWork;
