"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
class Nenza extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Ненза';
        this.minScore = 1;
        this.msg = 'Бачу тапок в закупі - report, ff, afk';
    }
    scorePoint(match, player_slot) {
        if (match.chat) {
            const nenzaMsg = match.chat.filter(msg => msg.player_slot === player_slot)
                .filter(msg => {
                const text = msg.key ? msg.key.toLowerCase() : '';
                return text.indexOf('ff') > -1
                    || text.indexOf('report') > -1;
            });
            return nenzaMsg.length;
        }
        return null;
    }
}
exports.Nenza = Nenza;
