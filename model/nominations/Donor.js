"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
const Constants_1 = require("../../Constants");
class Donor extends Nomination_1.Nomination {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Донор';
        this.minScore = 1;
        this.msg = 'Нє ну як не дати як просять?';
    }
    scorePoint(match, player_slot) {
        const objectives = DotaParser_1.DotaParser.getObjectives(match);
        const fbObjective = !!objectives ? objectives.find(obj => obj.type === Constants_1.Constants.OBJECTIVE_FB) : undefined;
        return !!fbObjective ? fbObjective.key === player_slot ? 1 : 0 : null;
    }
}
exports.Donor = Donor;
//# sourceMappingURL=Donor.js.map