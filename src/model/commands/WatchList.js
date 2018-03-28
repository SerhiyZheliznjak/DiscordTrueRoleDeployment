"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
class WatchList extends Command_1.CommandBase {
    process(msg) {
        if (this.isCreator(msg)) {
            this.dataStore.registeredPlayers.subscribe(playersMap => {
                let registered = 'Стежу за: ';
                for (const info of playersMap) {
                    registered += info + '\n';
                }
                msg.reply(registered);
            });
        }
        else {
            this.retardPlusPlus(msg);
            msg.reply('хуйочліст');
        }
    }
}
exports.WatchList = WatchList;
