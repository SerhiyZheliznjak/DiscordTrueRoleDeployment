"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const rxjs_1 = require("rxjs");
class WinRate extends Command_1.CommandBase {
    constructor() {
        super(...arguments);
        this.alreadyProcessing = false;
    }
    process(msg) {
        const arr = this.getArgs(msg.content.toLowerCase());
        if (this.alreadyProcessing) {
            msg.reply('Я знав що так буде, retardPlusPlus()');
            this.retardPlusPlus(msg);
            return;
        }
        if (arr.length === 0) {
            this.alreadyProcessing = true;
            this.dataStore.registeredPlayers.subscribe((registeredPlayers) => {
                const profileIds = Array.from(registeredPlayers.keys());
                rxjs_1.Observable.forkJoin(profileIds.map(account_id => this.mapAccountIdToWinRate(account_id, this.dataStore.getWinLoss(account_id)))).subscribe(accWinRate => this.sendMessage(msg, accWinRate));
            });
        }
        else {
            this.retardPlusPlus(msg);
        }
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
                return message + wr.winRate + '%: ' + wr.name + '\n';
            }, '\n');
            msg.reply(winratesMsg + '#тайтаке');
            this.alreadyProcessing = false;
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
