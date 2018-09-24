"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
class Nenza extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Ненза';
        this.minScore = 1;
        this.chatHistory = [];
    }
    get msg() {
        return 'Цитую: ' + this.chatHistory.join('/n');
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
                const words = msgText ? msgText.toLowerCase().split(' ') : [''];
                return words.indexOf('ff') > -1
                    || words.indexOf('report') > -1
                    || words.indexOf('пездець') > -1
                    || words.indexOf('нахуй') > -1
                    || words.indexOf('nahoi') > -1
                    || words.indexOf('уйобок') > -1
                    || words.indexOf('шлюхи') > -1
                    || words.indexOf('шлюха') > -1
                    || words.indexOf('підар') > -1
                    || words.indexOf('лох') > -1
                    || words.indexOf('suka') > -1
                    || words.indexOf('blyat') > -1
                    || words.indexOf('pidaras') > -1
                    || words.indexOf('fuck') > -1
                    || words.indexOf('gg') > -1
                    || words.indexOf('пп') > -1
                    || words.indexOf('хуй') > -1;
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
