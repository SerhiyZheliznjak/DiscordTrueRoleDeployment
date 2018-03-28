"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const Nominations_1 = require("../Nominations");
class NominationKeysReminder extends Command_1.CommandBase {
    process(msg) {
        this.dataStore.hallOfFame.subscribe((hallOfFame) => {
            let keys = '\n';
            const keyClassNameMap = Nominations_1.default.getKeyClassNameMap();
            for (const key of hallOfFame.keys()) {
                const className = keyClassNameMap.get(key);
                keys += className + ':\t' + hallOfFame.get(key).nominationName + '\n';
            }
            msg.reply(keys);
        });
    }
}
exports.NominationKeysReminder = NominationKeysReminder;
