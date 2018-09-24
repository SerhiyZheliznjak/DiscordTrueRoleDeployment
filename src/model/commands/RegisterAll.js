"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
class RegisterAll extends Command_1.CommandBase {
    process(msg) {
        if (!this.isCreator(msg)) {
            this.retardPlusPlus(msg);
            msg.reply('хуєгістеролл');
        }
        else {
            this.dataStore.registeredPlayers.subscribe(playersMap => {
                const myFriends = [
                    [298134653, '407971834689093632'],
                    [333303976, '407949091163865099'],
                    [118975931, '289388465034887178'],
                    [86848474, '408363774257528852'],
                    [314684987, '235372240160423936'],
                    [36753317, '408172132875501581'],
                ];
                myFriends.forEach(friend => {
                    if (!playersMap.get(friend[0])) {
                        this.dataStore.registerPlayer(friend[0], friend[1]);
                    }
                });
                msg.reply('зроблено, але ліпше перевір БД');
            });
        }
    }
    helpText() {
        return 'то тільки для Творця';
    }
}
exports.RegisterAll = RegisterAll;
