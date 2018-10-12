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
        this.nenzaWords = [
            this.getWordRegexp('ff'),
            this.getWordRegexp('fu'),
            this.getWordRegexp('fy'),
            this.getWordRegexp('report'),
            this.getWordRegexp('репорт'),
            this.getWordRegexp('пездець'),
            this.getWordRegexp('нахуй'),
            this.getWordRegexp('nahoi'),
            this.getWordRegexp('уйобок'),
            this.getWordRegexp('шлюхи'),
            this.getWordRegexp('шлюха'),
            this.getWordRegexp('підар'),
            this.getWordRegexp('suka'),
            this.getWordRegexp('blyat'),
            this.getWordRegexp('pidaras'),
            this.getWordRegexp('pidar'),
            this.getWordRegexp('fuck'),
            this.getWordRegexp('fucking'),
            this.getWordRegexp('noob'),
            this.getWordRegexp('єбало'),
            this.getWordRegexp('їбав'),
            this.getWordRegexp('їбало'),
            this.getWordRegexp('мут'),
            this.getWordRegexp('mute'),
            this.getWordRegexp('єваб')
        ];
    }
    get msg() {
        return 'Цитую:\n```"' + this.chatHistory.reduce((flat, arr) => {
            flat.push(...arr);
            return flat;
        }, []).join('"\n"') + '"\n```';
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
                .filter(msgText => this.isNenzaMessage(msgText));
            if (nenzaMsg.length > 0) {
                this.chatHistory.push(nenzaMsg);
            }
            return nenzaMsg.length;
        }
        return 0;
    }
    isNenzaMessage(msgText) {
        if (msgText) {
            const nenzaWord = this.nenzaWords.find(regExp => regExp.test(msgText));
            return !!nenzaWord;
        }
        else {
            return false;
        }
    }
    getWordRegexp(word) {
        return new RegExp(`(\\s|^)${word}(\\s|$)`, 'gi');
    }
}
exports.Nenza = Nenza;
