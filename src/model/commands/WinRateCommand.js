"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const rxjs_1 = require("rxjs");
class WinRate extends Command_1.CommandBase {
    process(msg) {
        if (!this.isLocked(msg)) {
            this.lock();
            this.dataStore.registeredPlayers.subscribe((registeredPlayers) => {
                const msgContent = msg.content.toLowerCase();
                if (this.getArgs(msg.content.toLowerCase()).length > 0) {
                    this.dataStore.getHeroes().subscribe(heroes => {
                        let hero_id;
                        const heroNames = Array.from(heroes.keys());
                        const heroName = heroNames.find(hn => msgContent.indexOf(hn.toLowerCase()) > -1);
                        if (heroName) {
                            hero_id = heroes.get(heroName);
                        }
                        this.countWinRate(msg, registeredPlayers, hero_id);
                    });
                }
                else {
                    this.countWinRate(msg, registeredPlayers);
                }
            });
        }
    }
    countWinRate(msg, registeredPlayers, hero_id) {
        const msgContent = msg.content.toLowerCase();
        const args = this.getArgs(msgContent);
        const accountIds = Array.from(registeredPlayers.keys());
        let mentionedIds;
        let with_ids;
        let without_ids;
        const mentions = args.filter(a => a.startsWith('<@')).map(m => m.match(/\d+/)[0]);
        if (mentions.length === 0) {
            mentionedIds = Array.from(registeredPlayers.keys());
        }
        else {
            mentionedIds = Array.from(registeredPlayers.entries())
                .filter(kv => mentions.indexOf(kv[1]) > -1)
                .map(kv => kv[0]);
        }
        if (msgContent.indexOf('without') > -1) {
            without_ids = mentionedIds;
        }
        else {
            with_ids = mentionedIds;
        }
        rxjs_1.Observable.forkJoin(accountIds.map(account_id => this.mapAccountIdToWinRate(account_id, this.dataStore.getWinLoss(account_id, hero_id, with_ids, without_ids)))).subscribe((accWinRate) => this.sendMessage(msg, accWinRate));
    }
    mapAccountIdToWinRate(account_id, winLoss) {
        return winLoss.map(wl => {
            const winrate = wl.win / (wl.lose + wl.win);
            return new AccountWinRate(account_id, Math.round(winrate * 10000) / 100);
        });
    }
    sendMessage(msg, accWinRates) {
        rxjs_1.Observable.forkJoin(accWinRates.map(awr => this.populateWithName(awr)))
            .subscribe(winrates => {
            const winratesMsg = winrates.sort((a, b) => b.winRate - a.winRate)
                .reduce((message, wr) => {
                const sign = wr.winRate > 50 ? '+' : '-';
                return message + sign + ' ' + wr.winRate + '%: ' + wr.name + '\n';
            }, '```diff\n');
            msg.reply(winratesMsg + '#тайтаке```');
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
    constructor(account_id, winRate, name) {
        this.account_id = account_id;
        this.winRate = winRate;
        this.name = name;
    }
}
