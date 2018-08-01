"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const rxjs_1 = require("rxjs");
const DotaApi_1 = require("../../dota-api/DotaApi");
class WinRate extends Command_1.CommandBase {
    process(msg) {
        const arr = this.getArgs(msg.content.toLowerCase());
        if (arr.length === 0) {
            this.dataStore.registeredPlayers.subscribe((registeredPlayers) => {
                const profileIds = Object.keys(registeredPlayers).map(pId => pId);
                rxjs_1.Observable.forkJoin(profileIds.map(id => DotaApi_1.default.getWinLoss(id).map((winloss) => {
                    return { id, };
                }))).subscribe();
            });
        }
        else {
            this.retardPlusPlus(msg);
        }
    }
}
exports.WinRate = WinRate;
