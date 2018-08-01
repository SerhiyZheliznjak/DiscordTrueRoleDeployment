"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const rxjs_1 = require("rxjs");
const DiscordUtils_1 = require("../../utils/DiscordUtils");
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
                const profileIds = Object.keys(registeredPlayers).map(stringId => +stringId);
                rxjs_1.Observable.forkJoin(profileIds.map(account_id => this.mapAccountIdToWinRate(account_id, this.dataStore.getWinLoss(account_id)))).subscribe(accWinRate => this.sendMessage(msg, accWinRate));
            });
        }
        else {
            this.retardPlusPlus(msg);
        }
    }
    mapAccountIdToWinRate(account_id, winLoss) {
        return winLoss.map(wl => {
            const winrate = (wl.win * 100) / (wl.loose + wl.win);
            return new AccountWinRate(account_id, winrate);
        });
    }
    sendMessage(msg, accWinRates) {
        rxjs_1.Observable.forkJoin(accWinRates.map(awr => this.populateWithName(awr)))
            .subscribe(winrates => {
            const winratesMsg = winrates.reduce((message, wr) => {
                return message + wr.name + ': ' + wr.winRate + '\n';
            }, '');
            msg.reply(DiscordUtils_1.DiscordUtils.getWinRateMessage(winratesMsg));
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
