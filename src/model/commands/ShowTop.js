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
        this.queue = new Map();
    }
    process(msg) {
        const args = this.parseArgs(msg);
        if (args && args.className) {
            const pendingChannels = this.queue.get(args.className);
            if (pendingChannels) {
                const exists = pendingChannels.find((ch) => ch.equals(msg.channel));
                if (!exists) {
                    console.log('adding new channel to queue');
                    pendingChannels.push(msg.channel);
                }
                else {
                    this.retardPlusPlus(msg);
                }
            }
            else {
                console.log('sending request to get top best');
                this.queue.set(args.className, [msg.channel]);
                this.nominationService.getTopN(args.className, args.n).subscribe(topRes => {
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
                        this.queue.get(args.className).forEach(channel => {
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
    parseArgs(msg) {
        const arr = this.getArgs(msg.content.toLowerCase());
        if (arr.length === 1) {
            return new TopArgs(3, arr[0]);
        }
        else if (arr.length === 2) {
            const n = parseInt(arr[0]);
            if (isNaN(n)) {
                console.error('second arg is not a number');
            }
            else {
                return new TopArgs(n, arr[1]);
            }
        }
        return undefined;
    }
}
exports.ShowTop = ShowTop;
class TopArgs {
    constructor(n, className) {
        this.n = n;
        this.className = className;
        this.className = className.toLowerCase();
    }
}
