"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const Pair_1 = require("../Pair");
class RegisterAll extends Command_1.CommandBase {
    process(msg) {
        if (!this.isCreator(msg)) {
            this.retardPlusPlus(msg);
            msg.reply('хуєгістеролл');
        }
        else {
            this.dataStore.registeredPlayers.subscribe(playersMap => {
                const myFriends = [
                    new Pair_1.default(298134653, '407971834689093632'),
                    new Pair_1.default(333303976, '407949091163865099'),
                    new Pair_1.default(118975931, '289388465034887178'),
                    new Pair_1.default(86848474, '408363774257528852'),
                    new Pair_1.default(314684987, '413792999030652938'),
                    new Pair_1.default(36753317, '408172132875501581'),
                ];
                myFriends.forEach(friend => {
                    if (!playersMap.get(friend.p1)) {
                        this.dataStore.registerPlayer(friend.p1, friend.p2);
                    }
                });
                msg.reply('зроблено, але ліпше перевір БД');
            });
        }
    }
}
exports.RegisterAll = RegisterAll;
