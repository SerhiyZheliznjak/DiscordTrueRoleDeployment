"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const DiscordUtils_1 = require("../../utils/DiscordUtils");
class HeroNames extends Command_1.CommandBase {
    process(msg) {
        if (!this.isLocked(msg)) {
            this.dataStore.getHeroes().subscribe(heroesMap => {
                const heroNames = Array.from(heroesMap.keys()).sort().join('\n');
                msg.reply(DiscordUtils_1.DiscordUtils.formatAsBlock(heroNames));
            });
        }
    }
    helpText() {
        return 'Повертає всі імена героїв, які можна використовувати для команди winrate';
    }
}
exports.HeroNames = HeroNames;
