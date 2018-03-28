"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
const Constants_1 = require("../../Constants");
class Donor extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Донор';
        this.minScore = 3;
        this.msg = 'Благородне діло, но не в доті';
    }
    getScoreText() {
        return 'Віддано першої крові: ' + this.getScore();
    }
    getScoreDescription() {
        return ' віддатись на першу кров ';
    }
    getThumbURL() {
        return 'https://n6-img-fp.akamaized.net/vetores-gratis/fundo-do-dia-do-doador-com-mensagem_23-2147625494.jpg?size=338&ext=jpg';
    }
    scorePoint(match, player_slot) {
        if (!match) {
            return 0;
        }
        const objectives = DotaParser_1.DotaParser.getObjectives(match);
        const fbObjective = !!objectives ? objectives.find(obj => obj.type === Constants_1.default.OBJECTIVE_FB) : undefined;
        return !!fbObjective ? fbObjective.key === player_slot ? 1 : 0 : 0;
    }
}
exports.Donor = Donor;
