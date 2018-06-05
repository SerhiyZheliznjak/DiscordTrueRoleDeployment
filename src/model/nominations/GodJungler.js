"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class GodJungler extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Лісник від Бога (нє)';
        this.minScore = 3;
        this.msg = 'Якісь кріпи незбалансовані!\n'
            + 'Вмер від нейтрального кріпа не менше 3х разів';
    }
    getScoreText() {
        return 'Кількість смертей від кріпів: ' + this.getScore();
    }
    getScoreDescription() {
        return ' вмерти від кріпів';
    }
    getThumbURL() {
        return 'https://image.ibb.co/dpc0A8/creeps_are_a_huge_part_of_every_dota_2_match.jpg';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        if (!player || !player.killed_by) {
            return 0;
        }
        let killedByNeutralCount = 0;
        for (const killer in player.killed_by) {
            if (killer.indexOf('npc_dota_neutral') > -1) {
                killedByNeutralCount += player.killed_by[killer];
            }
        }
        return killedByNeutralCount;
    }
}
exports.GodJungler = GodJungler;
