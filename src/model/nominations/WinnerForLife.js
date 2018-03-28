"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class WinnerForLife extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Пабідітіль па жизні';
        this.minScore = 10;
        this.msg = 'Всі хочуть його в тіму, а хто не хоче той просто заздрит\nБільше 10ти перемог';
    }
    getScoreText() {
        return 'Виграно матчів: ' + this.getScore();
    }
    getScoreDescription() {
        return ' виграти матчів ';
    }
    getThumbURL() {
        return 'https://www.dropbox.com/s/qo5mfwo84h2k6p8/winnerForLife.jpg?dl=0';
    }
    scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
            return player && player.win ? player.win : 0;
        }
        return 0;
    }
}
exports.WinnerForLife = WinnerForLife;
