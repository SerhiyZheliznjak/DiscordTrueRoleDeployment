"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nomination_1 = require("../Nomination");
const DotaParser_1 = require("../../services/DotaParser");
class WinnerForLife extends Nomination_1.Nomination {
    constructor(points = []) {
        super(points);
        this.points = points;
        this.name = 'Пабідітіль па жизні';
        this.minScore = 10;
        this.msg = 'Всі хочуть його в тіму, а хто не хоче той просто заздрЕ';
    }
    scorePoint(match, player_slot) {
        if (!!match) {
            return DotaParser_1.DotaParser.getPlayerInfo(match, player_slot).win;
        }
        return 0;
    }
}
exports.WinnerForLife = WinnerForLife;
//# sourceMappingURL=WinnerForLife.js.map