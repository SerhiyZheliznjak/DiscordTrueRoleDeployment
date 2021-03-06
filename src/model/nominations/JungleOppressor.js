"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class JungleOppressor extends Nomination_1.default {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Гнобитель Джунглів';
        this.minScore = 1;
        this.msg = 'Пацани не шарю що ви там робите, але я цілі джунглі пресую!\n'
            + 'Наніс більше шкоди лісним кріпам ніж героям, кріпам і будівлям разом взятим';
    }
    getScoreText() {
        return 'Кількість матчів з цим "досягненням": ' + this.getScore();
    }
    getScoreDescription() {
        return ' гнобити джунглі протягом числа матчів';
    }
    getThumbURL() {
        return 'https://image.ibb.co/b1XsfS/Jungler.jpg';
    }
    scorePoint(match, player_slot) {
        const player = DotaParser_1.DotaParser.getPlayerInfo(match, player_slot);
        if (!player || !player.damage) {
            return 0;
        }
        let jungleDamaged = 0;
        let objectiveDamage = 0;
        for (const target in player.damage) {
            if (player.damage.hasOwnProperty(target)) {
                if (target.indexOf('npc_dota_neutral') === 0) {
                    jungleDamaged += player.damage[target];
                }
                else {
                    objectiveDamage += player.damage[target];
                }
            }
        }
        return jungleDamaged > objectiveDamage ? 1 : 0;
    }
}
exports.JungleOppressor = JungleOppressor;
