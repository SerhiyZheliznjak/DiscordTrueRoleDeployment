"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const rxjs_1 = require("rxjs");
class WinRate extends Command_1.CommandBase {
    process(msg) {
        if (!this.isLocked(msg)) {
            this.lock();
            this.dataStore.registeredPlayers.subscribe((registeredPlayers) => {
                const args = this.getArgs(msg.content.toLowerCase());
                if (args.length > 0) {
                    this.dataStore.getHeroes().subscribe(heroes => {
                        let hero_id;
                        const heroNames = Array.from(heroes.keys());
                        const heroName = heroNames.find(hn => args.indexOf(hn.toLowerCase()) > -1);
                        if (heroName) {
                            hero_id = heroes.get(heroName);
                        }
                        this.countWinRate(msg, registeredPlayers, hero_id, heroName);
                    });
                }
                else {
                    this.countWinRate(msg, registeredPlayers);
                }
            });
        }
    }
    helpText() {
        return 'winrate @MENTION? HERO_NAME? without? @MENTION\n'
            + '@MENTION рахуватиме ігри з цими гравцями, якщо не вказати рахуватиме для всіх;\n'
            + 'HERO_NAME назва героя. Перший @MENTION - той хто ним грав, якщо нема то для всіх на цьому герої;\n'
            + 'without опційне буде рахувати ігри без гравців вказаних після without.';
    }
    countWinRate(msg, registeredPlayers, hero_id, heroName) {
        const msgContent = msg.content.toLowerCase();
        const args = this.getArgs(msgContent);
        const mentions = this.getIdsFromMentions(args);
        const with_ids = this.getWithOrWithouts(msgContent, registeredPlayers);
        const without_ids = this.getWithOrWithouts(msgContent, registeredPlayers, false);
        const countingAll = this.countingEachOne(args, with_ids);
        let accountIdsToCount;
        let messageHeader = 'Вінрейт ';
        if (countingAll) {
            accountIdsToCount = Array.from(registeredPlayers.keys());
            messageHeader += 'кожного ';
        }
        if (mentions.length > 0) {
            if (with_ids.length) {
                messageHeader += this.getMentionedNamesString(msg, with_ids) + ' ';
                accountIdsToCount = this.getDotaAccountId([with_ids.shift()], registeredPlayers);
            }
            if (without_ids.length) {
                messageHeader += 'без ' + this.getMentionedNamesString(msg, without_ids) + ' ';
            }
        }
        if (heroName) {
            if (accountIdsToCount.length) {
                messageHeader += countingAll ? '' : 'коли ';
                messageHeader += this.getMentionedNamesString(msg, [registeredPlayers.get(accountIdsToCount[0])]);
                messageHeader += countingAll ? '' : ' ';
            }
            messageHeader += 'на ' + heroName + ' ';
        }
        rxjs_1.Observable.forkJoin(accountIdsToCount.map(account_id => this.mapAccountIdToWinRate(account_id, this.dataStore.getWinLoss(account_id, hero_id, this.getDotaAccountId(with_ids, registeredPlayers), this.getDotaAccountId(without_ids, registeredPlayers))))).subscribe((accWinRate) => this.sendMessage(msg, accWinRate, messageHeader));
    }
    countingEachOne(args, with_ids) {
        return args.length === 0 || with_ids.length === 0;
    }
    getMentionedNamesString(msg, mentioned) {
        return Array.from(msg.mentions.members.values())
            .filter(member => mentioned.indexOf(member.id) > -1)
            .map(member => member.displayName).join(', ');
    }
    getWithOrWithouts(msgContent, registeredPlayers, include = true) {
        const index = include ? 0 : 1;
        const mentions = msgContent.split(' without ')[index];
        if (!!mentions) {
            return this.getIdsFromMentions(this.split(mentions));
        }
        return [];
    }
    getIdsFromMentions(args) {
        return args.filter(a => a.startsWith('<@')).map(m => m.match(/\d+/)[0]);
    }
    getDotaAccountId(discordIds, registeredPlayers) {
        return Array.from(registeredPlayers.entries())
            .filter(kv => discordIds.indexOf(kv[1]) > -1)
            .map(kv => kv[0]);
    }
    mapAccountIdToWinRate(account_id, winLoss) {
        return winLoss.map(wl => {
            const winrate = wl.win / (wl.lose + wl.win);
            return new AccountWinRate(account_id, Math.round(winrate * 10000) / 100, wl.win + wl.lose);
        });
    }
    sendMessage(msg, accWinRates, messageHeader) {
        rxjs_1.Observable.forkJoin(accWinRates.map(awr => this.populateWithName(awr)))
            .subscribe(winrates => {
            const winratesMsg = winrates.filter(wr => !isNaN(wr.winRate)).sort((a, b) => b.winRate - a.winRate)
                .reduce((message, wr) => {
                const sign = wr.winRate > 50 ? '+' : '-';
                const palyerName = accWinRates.length > 1 ? ': ' + wr.name : '';
                return message + sign + ' ' + wr.winRate + '% з ' + wr.count + palyerName + '\n';
            }, '```diff\n' + messageHeader + '\n');
            msg.channel.send(winratesMsg + '#тайтаке```');
            this.unlock();
        });
    }
    populateWithName(awr) {
        return this.dataStore.getProfile(awr.account_id).map(profile => {
            awr.name = profile.personaname;
            return awr;
        });
    }
}
exports.WinRate = WinRate;
class AccountWinRate {
    constructor(account_id, winRate, count, name) {
        this.account_id = account_id;
        this.winRate = winRate;
        this.count = count;
        this.name = name;
    }
}
