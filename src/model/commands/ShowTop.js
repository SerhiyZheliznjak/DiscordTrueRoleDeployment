"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const rxjs_1 = require("rxjs");
const NominationService_1 = require("../../services/NominationService");
const DiscordUtils_1 = require("../../utils/DiscordUtils");
class ShowTop extends Command_1.CommandBase {
    constructor(client, dataStore, nominationService = new NominationService_1.default()) {
        super(client, dataStore);
        this.nominationService = nominationService;
    }
    process(msg) {
        const arr = this.parseTopNMessage(msg);
        if (arr.length !== 0) {
            const n = arr.length === 2 ? 3 : parseInt(arr[1]); // return top 3 by default
            const className = arr.length === 3 ? arr[1] : arr[2];
            const nominationName = className.toLowerCase();
            if (nominationName) {
                const pendingChannels = this.queue.get(nominationName);
                if (pendingChannels) {
                    const exists = pendingChannels.find((ch) => ch.equals(msg.channel));
                    if (!exists) {
                        console.log('adding new channel to queue');
                        pendingChannels.push(msg.channel);
                    }
                }
                else {
                    console.log('sending request to get top best');
                    this.queue.set(nominationName, [msg.channel]);
                    this.nominationService.getTopN(nominationName, n).subscribe(topRes => {
                        const accountIdsSet = topRes.map(r => r.account_id)
                            .filter((account_id, pos, self) => self.indexOf(account_id) === pos);
                        rxjs_1.Observable.from(accountIdsSet)
                            .flatMap(account_id => this.dataStore.getProfile(account_id))
                            .reduce((profileMap, profile) => {
                            profileMap.set(profile.account_id, profile.personaname);
                            return profileMap;
                        }, new Map())
                            .subscribe((profileMap) => {
                            const firstNomination = topRes[0].nomination;
                            let msgText = 'Вони зуміли\n';
                            topRes.forEach((tr, index) => {
                                const place = index + 1;
                                msgText += place + ') ' + profileMap.get(tr.account_id) + ':\t' + tr.nomination.getScoreText() + '\n';
                            });
                            this.queue.get(nominationName).forEach(channel => {
                                channel.send('', DiscordUtils_1.DiscordUtils.getRichEmbed(firstNomination.getName(), msgText, undefined, '#Тайтаке.'));
                            });
                        });
                    });
                }
            }
            else {
                this.retardPlusPlus(msg);
            }
        }
    }
    parseTopNMessage(msg) {
        const arr = msg.content.toLowerCase().split(' ');
        if (arr.length === 2 || arr.length === 3) {
            return arr;
        }
        else {
            this.retardPlusPlus(msg);
        }
        return [];
    }
}
exports.ShowTop = ShowTop;
