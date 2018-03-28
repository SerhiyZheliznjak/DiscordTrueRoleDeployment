"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class Looser extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Шота не йде';
        this.minScore = 10;
        this.msg = 'Всьо то саме що пабідітіль, от тільки не то щоб його в тіму хтіли, та й не дуже то заздрят\n' +
            'Переживає смугу програшів';
    }
    getScoreText() {
        return 'Програно матчів: ' + this.getScore();
    }
    getScoreDescription() {
        return ' перемогти, тільки навпаки';
    }
    getThumbURL() {
        return 'https://www.dropbox.com/s/v16doe6rq6q0l5j/looser.png?dl=0';
    }
    scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
            return player && player.lose ? player.lose : 0;
        }
        return 0;
    }
}
exports.Looser = Looser;
