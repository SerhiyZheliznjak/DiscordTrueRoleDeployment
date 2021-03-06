"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const discord_js_1 = require("discord.js");
const rxjs_1 = require("rxjs");
const DiscordUtils_1 = require("../../utils/DiscordUtils");
class ShowTop extends Command_1.CommandBase {
    constructor(client, dataStore, nominationService) {
        super(client, dataStore);
        this.nominationService = nominationService;
        this.queue = new Map();
    }
    process(msg) {
        if (!this.isLocked(msg)) {
            const args = this.parseArgs(msg);
            if (args && args.className) {
                const pendingChannels = this.queue.get(args.className);
                if (pendingChannels) {
                    const exists = pendingChannels.find((ch) => ch.equals(msg.channel));
                    if (!exists) {
                        pendingChannels.push(msg.channel);
                    }
                    else {
                        this.retardPlusPlus(msg);
                    }
                }
                else {
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
                            .subscribe((profileMap) => this.sendTopNMessage(args.className, profileMap, topRes));
                    });
                }
            }
            else {
                this.retardPlusPlus(msg);
            }
        }
    }
    sendTopNMessage(className, profileMap, topRes) {
        this.queue.get(className).forEach(channel => {
            const embed = this.generateEmbed(profileMap, topRes);
            if (embed) {
                channel.send('', embed);
                this.queue.delete(className);
            }
        });
    }
    generateEmbed(profileMap, topRes) {
        if (profileMap.size && topRes.length) {
            const longestProfileName = this.getLongestLength(profileMap);
            const firstNomination = topRes[0].nomination;
            let msgText = '';
            topRes.forEach((tr, index) => {
                const place = index + 1;
                const name = profileMap.get(tr.account_id).padEnd(longestProfileName);
                msgText += '#' + place + ' ' + name + ': ' + tr.nomination.scoreToString() + '\n';
            });
            const richEmbed = new discord_js_1.RichEmbed();
            richEmbed.setTitle('Вони зуміли' + firstNomination.getScoreDescription());
            richEmbed.setDescription(DiscordUtils_1.DiscordUtils.formatAsBlock(msgText));
            richEmbed.setThumbnail(firstNomination.getThumbURL());
            richEmbed.setFooter('#Тайтаке.');
            return richEmbed;
        }
    }
    getLongestLength(profileMap) {
        return DiscordUtils_1.DiscordUtils.getLongestLength([...profileMap].map(p => p[1]));
    }
    helpText() {
        return 'top NOMINATION_KEY, використовуй команду nominationkeys щоб дізнатись ключ потрібної номінації';
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
