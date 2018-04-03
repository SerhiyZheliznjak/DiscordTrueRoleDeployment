"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class BadRapist extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Такий собі рапірщик';
        this.minScore = 1;
        this.msg = 'Поганому рапірщику яйця мішають... Купив рапіру і програв';
    }
    getScoreText() {
        return 'Куплено рапір у програних матчах: ' + this.getScore();
    }
    getScoreDescription() {
        return ' понакупляти рапір і програли';
    }
    getThumbURL() {
        return 'https://image.ibb.co/bHyf9x/Rapier_Loose.jpg';
    }
    scorePoint(match, player_slot) {
        if (!!match) {
            const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
            return player && player.purchase_rapier && player.win !== null && !player.win ? player.purchase_rapier : 0;
        }
        return 0;
    }
}
exports.BadRapist = BadRapist;
