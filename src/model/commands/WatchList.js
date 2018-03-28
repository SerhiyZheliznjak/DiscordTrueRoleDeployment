"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
class WatchList extends Command_1.CommandBase {
    process(msg) {
        if (!this.isCreator(msg)) {
            this.retardPlusPlus(msg);
            msg.reply('хуєгістеролл');
        }
        else {
            this.dataStore.registeredPlayers.subscribe(playersMap => {
                if (playersMap.size === 0) {
                    this.dataStore.registerPlayer(298134653, '407971834689093632'); // Dno
                    this.dataStore.registerPlayer(333303976, '407949091163865099'); // Tee Hee
                    this.dataStore.registerPlayer(118975931, '289388465034887178'); // I'm 12 btw GG.BET
                    this.dataStore.registerPlayer(86848474, '408363774257528852'); // whoami
                    this.dataStore.registerPlayer(314684987, '413792999030652938'); // Малий Аднрюхи (Денис)
                    this.dataStore.registerPlayer(36753317, '408172132875501581'); // =3
                }
            });
        }
    }
}
exports.WatchList = WatchList;
