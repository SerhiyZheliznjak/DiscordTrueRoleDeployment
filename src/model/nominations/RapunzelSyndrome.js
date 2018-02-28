"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
const Constants_1 = require("../../Constants");
class RapunzelSyndrome extends Nomination_1.Nomination {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Синдром Рапунзель';
        this.minScore = 1;
        this.msg = 'Вежу ліпше знести ніж в ній сидіти';
    }
    // this way it counts if team killed towers, if want to award for all towers kill then just check if player.towers_killed === 10
    scorePoint(match, player_slot) {
        const objectives = DotaParser_1.DotaParser.getObjectives(match);
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        if (!objectives || !player) {
            return null;
        }
        const towerIdentifier = player.isRadiant ? Constants_1.Constants.DIRE_TOWER_TARGET_IDENTIFIER : Constants_1.Constants.RADIANT_TOWER_TARGET_IDENTIFIER;
        const killedAllTowers = objectives.filter(obj => !!obj.key && !!obj.key.indexOf && obj.key.indexOf(towerIdentifier) === 0)
            .every(obj => obj.player_slot === player_slot);
        return killedAllTowers ? 1 : 0;
    }
}
exports.RapunzelSyndrome = RapunzelSyndrome;
