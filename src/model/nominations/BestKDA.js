"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
const Constants_1 = require("../../Constants");
class BestKDA extends Nomination_1.Nomination {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'А шо то в вас? KDA?';
        this.minScore = 1;
        this.msg = 'От в мене KDA то KDA';
    }
    getScore() {
        const kdaArr = this.getPoints().map(p => this.countKDA(p.val + ''));
        return Math.max(...kdaArr);
    }
    getScoreText() {
        const bestKDA = this.getPoints().map(p => p.val + '').reduce((max, next) => {
            if (this.countKDA(max) < this.countKDA(next)) {
                return next;
            }
            return max;
        }, '0/0/0');
        return bestKDA;
    }
    scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
            const matchResult = player.win === 1 ? Constants_1.Constants.WON : Constants_1.Constants.LOST;
            return !!player && player.kills !== null && player.deaths !== null && player.assists !== null
                ? player.kills + '/' + player.deaths + '/' + player.assists + '/' + matchResult
                : null;
        }
        return '0/0/0';
    }
    countKDA(kdaText) {
        if (!kdaText) {
            return 0;
        }
        const kda = kdaText.split('/');
        return (parseInt(kda[0]) + parseInt(kda[2])) / (parseInt(kda[1]) + 1);
    }
}
exports.BestKDA = BestKDA;