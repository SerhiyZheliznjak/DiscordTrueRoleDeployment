"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const Nominations_1 = require("../Nominations");
const DiscordUtils_1 = require("../../utils/DiscordUtils");
class NominationKeysReminder extends Command_1.CommandBase {
    process(msg) {
        this.dataStore.hallOfFame.subscribe((hallOfFame) => {
            let keys = '\n';
            const keyClassNameMap = Nominations_1.default.getKeyClassNameMap();
            const alignLength = DiscordUtils_1.DiscordUtils.getLongestLength([...keyClassNameMap].map(k => k[1]));
            for (const key of hallOfFame.keys()) {
                const className = keyClassNameMap.get(key);
                keys += DiscordUtils_1.DiscordUtils.fillWithSpaces(className, alignLength) + ': ' + hallOfFame.get(key).nominationName + '\n';
            }
            msg.reply(DiscordUtils_1.DiscordUtils.formatAsBlock(keys));
        });
    }
}
exports.NominationKeysReminder = NominationKeysReminder;
