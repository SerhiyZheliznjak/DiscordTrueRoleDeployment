"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
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
        return ' віддатись на першу кров';
    }
    getThumbURL() {
        return 'https://image.ibb.co/gZYzc7/DONOR.jpg';
    }
    scorePoint(match, player_slot) {
        const objectives = DotaParser_1.DotaParser.getObjectives(match);
        if (!objectives) {
            return 0;
        }
        const fbObjective = objectives.find(obj => obj.type === 'CHAT_MESSAGE_FIRSTBLOOD');
        return !!fbObjective ? fbObjective.key === player_slot ? 1 : 0 : 0;
    }
}
exports.Donor = Donor;
