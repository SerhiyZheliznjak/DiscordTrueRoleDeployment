"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
class Nenza extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Ненза';
        this.minScore = 1;
        // this.msg = 'Бачу тапок в закупі - ';
        this.chatHistory = [];
    }
    get msg() {
        return 'Бачу тапок в закупі - ' + this.chatHistory;
    }
    getScoreText() {
        return 'Кількість написаної херні в чаті: ' + this.getScore();
    }
    getScoreDescription() {
        return ' понаписувати херні';
    }
    getThumbURL() {
        return 'https://image.ibb.co/jLzG77/Nenza.jpg';
    }
    scorePoint(match, player_slot) {
        if (match && match.chat) {
            const nenzaMsg = match.chat.filter(msg => msg.player_slot === player_slot)
                .map(msg => msg.key)
                .filter(msgText => {
                const text = msgText ? msgText.toLowerCase() : '';
                return text.indexOf('ff') > -1
                    || text.indexOf('report') > -1;
            });
            if (nenzaMsg.length > 0) {
                this.chatHistory.push(nenzaMsg);
            }
            return nenzaMsg.length;
        }
        return 0;
    }
}
exports.Nenza = Nenza;
