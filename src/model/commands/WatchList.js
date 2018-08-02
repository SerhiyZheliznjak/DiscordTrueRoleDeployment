"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const DiscordUtils_1 = require("../../utils/DiscordUtils");
class WatchList extends Command_1.CommandBase {
    process(msg) {
        if (this.isCreator(msg)) {
            this.dataStore.registeredPlayers.subscribe(playersMap => {
                let registered = 'Стежу за: ';
                for (const info of playersMap) {
                    registered += info + '\n';
                }
                msg.reply(DiscordUtils_1.DiscordUtils.formatAsBlock(registered));
            });
        }
        else {
            this.retardPlusPlus(msg);
            msg.reply('хуйочліст');
        }
    }
    helpText() {
        return 'то тільки для Творця';
    }
}
exports.WatchList = WatchList;
