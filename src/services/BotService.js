"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rxjs_1 = require("rxjs");
const DataStore_1 = require("./DataStore");
const NominationService_1 = require("./NominationService");
const StorageService_1 = require("./StorageService");
const Constants_1 = require("../Constants");
const Pair_1 = require("../model/Pair");
const Nominations_1 = require("../model/Nominations");
class BotService {
    constructor(client, dataStore = new DataStore_1.default(), nominationService = new NominationService_1.default(), storageService = new StorageService_1.default()) {
        this.client = client;
        this.dataStore = dataStore;
        this.nominationService = nominationService;
        this.storageService = storageService;
        this.retardMap = new Map();
        this.chanel = this.client.channels.find('type', 'text');
        this.nominationKeysMap = Nominations_1.default.all.reduce((map, nomination) => {
            map.set(nomination.constructor.name.toLowerCase(), nomination.getName());
            return map;
        }, new Map());
    }
    processMesage(msg) {
        if (msg.author.bot) {
            return;
        }
        if (this.isRetard(msg.author.id)) {
            this.shutUpYouRRetard(msg);
            return;
        }
        if (msg.content.toLocaleLowerCase() === 'restart') {
            this.restart(msg);
        }
        if (msg.content.toLocaleLowerCase() === 'registerall') {
            this.registerall(msg);
        }
        if (msg.content.toLowerCase().startsWith('watch')) {
            this.addWatch(msg);
        }
        if (msg.content.toLocaleLowerCase() === 'watchlist') {
            this.showRegistered(msg);
        }
        if (msg.content.toLowerCase().startsWith('нагадай ключі')) {
            this.showNominationKeys(msg);
        }
        if (msg.content.toLowerCase().startsWith('хто топ ')) {
            this.getTopN(msg);
        }
    }
    forgiveRetards() {
        rxjs_1.Observable.interval(Constants_1.default.FORGIVE_RETARDS_INTERVAL).subscribe(() => this.retardMap = new Map());
    }
    startNominating() {
        this.dataStore.registeredPlayers.subscribe(playersMap => {
            this.claimedNominationsSubscription = this.nominationService.startNominating(playersMap)
                .subscribe((newNomintionsClaimed) => {
                this.generateMessages(newNomintionsClaimed).subscribe((richEmbed) => {
                    this.chanel.send('', richEmbed);
                });
            });
        });
    }
    isRetard(authorId) {
        const retardCount = this.retardMap.get(authorId);
        if (retardCount && retardCount.length > 3 && retardCount) {
            return retardCount.reduce((r, c, i) => {
                const next = retardCount[i + 1];
                if (next) {
                    return r > next - c ? next - c : r;
                }
                return r;
            }) < 60 * 1000;
        }
        return false;
    }
    retardPlusPlus(msg) {
        const authorId = msg.author.id;
        if (!this.retardMap.get(authorId)) {
            this.retardMap.set(authorId, []);
        }
        const retardCount = this.retardMap.get(authorId);
        retardCount.push(new Date().getTime());
        if (retardCount.length > 3) {
            if (this.isRetard(authorId)) {
                this.client.channels.find('type', 'text').send('@everyone Чат, небезпека - розумововідсталий!');
            }
            else {
                retardCount.shift();
            }
        }
        console.log('retard++');
    }
    shutUpYouRRetard(msg) {
        const shutRetard = ['Стягнув', 'Ти такий розумний', 'Помовчи трохи', 'Т-с-с-с-с-с-с',
            'Біжи далеко', 'Ти можеш трохи тихо побути?', 'Ціхо', 'Каца!', 'Таааась тась тась',
            'Люди, йдіть сі подивіть', 'Інколи краще жувати', 'Ти то серйозно?', 'Молодець'];
        msg.reply(shutRetard[Math.floor(Math.random() * shutRetard.length)]);
    }
    registerall(msg) {
        if (!this.isCreator(msg)) {
            this.retardPlusPlus(msg);
            msg.reply('хуєгістеролл');
        }
        else {
            this.dataStore.registeredPlayers.subscribe(playersMap => {
                if (playersMap.size === 0) {
                    this.dataStore.registerPlayer(298134653, '407971834689093632'); // Dno
                    this.dataStore.registerPlayer(333303976, '407949091163865099'); // Tee Hee
                    this.dataStore.registerPlayer(118975931, '289388465034887178'); // I'm 12 btw GG.BET
                    this.dataStore.registerPlayer(86848474, '408363774257528852'); // whoami
                    this.dataStore.registerPlayer(314684987, '413792999030652938'); // Малий Аднрюхи (Денис)
                    this.dataStore.registerPlayer(36753317, '408172132875501581'); // =3
                }
            });
        }
    }
    restart(msg) {
        if (this.isCreator(msg)) {
            this.stopNominating();
            this.startNominating();
        }
        else {
            this.retardPlusPlus(msg);
            msg.reply('хуємпездрестарт');
        }
    }
    showRegistered(msg) {
        if (this.isCreator(msg)) {
            this.dataStore.registeredPlayers.subscribe(playersMap => {
                let registered = 'Стежу за: ';
                for (const info of playersMap) {
                    registered += info + '\n';
                }
                msg.reply(registered);
            });
        }
        else {
            this.retardPlusPlus(msg);
            msg.reply('хуйочліст');
        }
    }
    addWatch(msg) {
        if (msg.mentions.users.array().length === 0) {
            msg.reply('Тобі показати як вставити своє ім\'я в повідомлення?');
            this.retardPlusPlus(msg);
        }
        else if (msg.mentions.users.array().length > 1) {
            msg.reply('Ти зовсім дурне? Як я маю всіх підряд зареєструвати?');
            this.retardPlusPlus(msg);
        }
        else if (msg.content.split(' ').filter(word => word !== '').length !== 3) {
            msg.reply('Курва... Шо ти пишеш?.. Має бути "watch @КОРИСТУВАЧ DOTA_ID"');
            this.retardPlusPlus(msg);
        }
        else {
            this.dataStore.getProfile(parseInt(msg.content.match(/ \d+/)[0].trim())).subscribe(playerInfo => {
                if (!!playerInfo) {
                    this.dataStore.registeredPlayers.subscribe(playersMap => {
                        if (playersMap.get(playerInfo.account_id) && !this.isCreator(msg)) {
                            msg.reply('Вже закріплено за @' + playersMap.get(playerInfo.account_id));
                            this.retardPlusPlus(msg);
                        }
                        else {
                            this.dataStore.registerPlayer(playerInfo.account_id, msg.mentions.users.first().id);
                            msg.reply('Я стежитиму за тобою, ' + playerInfo.personaname);
                        }
                    });
                }
                else {
                    msg.reply('Давай ще раз, але цього разу очима дивись на айді гравця');
                    this.retardPlusPlus(msg);
                }
            });
        }
    }
    isCreator(msg) {
        return msg.author.id === process.env.creatorId;
    }
    stopNominating() {
        this.nominationService.stopNominating();
        if (this.claimedNominationsSubscription) {
            this.claimedNominationsSubscription.unsubscribe();
        }
    }
    getRichEmbed(title, description, avatarUrl, footer, url) {
        const richEmbed = new discord_js_1.RichEmbed();
        richEmbed.setTitle(title);
        richEmbed.setDescription(description);
        richEmbed.setImage(avatarUrl);
        richEmbed.setFooter(footer);
        if (url) {
            richEmbed.setURL(url);
        }
        return richEmbed;
    }
    generateMessages(claimedNominations) {
        return rxjs_1.Observable.from(claimedNominations)
            .flatMap(cn => this.getNominationWithPlayerProfile(cn))
            .map(pair => this.getRichEmbed(pair.p2.personaname + ': ' + pair.p1.nomination.getName(), pair.p1.nomination.getMessage(), pair.p2.avatarmedium, pair.p1.nomination.getScoreText(), pair.p2.profileurl));
    }
    getNominationWithPlayerProfile(claimedNomination) {
        return this.dataStore.getProfile(claimedNomination.account_id).map(profile => new Pair_1.default(claimedNomination, profile));
    }
    showNominationKeys(msg) {
        this.dataStore.hallOfFame.subscribe((hallOfFame) => {
            let keys = '\n';
            const keyClassNameMap = Nominations_1.default.getKeyClassNameMap();
            for (const key of hallOfFame.keys()) {
                const className = keyClassNameMap.get(key);
                keys += className + ':\t' + hallOfFame.get(key).nominationName + '\n';
            }
            msg.reply(keys);
        });
    }
    getTopN(msg) {
        const arr = this.parseTopNMessage(msg);
        if (arr.length !== 0) {
            const n = arr.length === 3 ? 3 : parseInt(arr[2]); // return top 3 by default
            const className = arr.length === 3 ? arr[2] : arr[3];
            const nominationName = className.toLowerCase();
            if (nominationName) {
                this.nominationService.getTopN(nominationName, n).subscribe(topRes => {
                    const accountIdsSet = topRes.map(r => r.account_id)
                        .filter((account_id, pos, self) => self.indexOf(account_id) === pos);
                    rxjs_1.Observable.from(accountIdsSet)
                        .flatMap(account_id => this.dataStore.getProfile(account_id))
                        .reduce((profileMap, profile) => {
                        profileMap.set(profile.account_id, profile.name);
                        return profileMap;
                    }, new Map())
                        .subscribe((profileMap) => {
                        const firstNomination = topRes[0].nomination;
                        let msgText = 'Ці герої зуміли' + firstNomination.getScoreDescription() + '\n';
                        topRes.forEach((tr, index) => {
                            const place = index + 1;
                            msgText += place + ') ' + profileMap.get(tr.account_id) + ': ' + tr.nomination.getScore() + '\n';
                        });
                        this.chanel.send('', this.getRichEmbed(firstNomination.getName(), msgText, undefined, '#Тайтаке.'));
                    });
                });
            }
            else {
                this.retardPlusPlus(msg);
            }
        }
    }
    parseTopNMessage(msg) {
        const arr = msg.content.toLowerCase().split(' ');
        if (arr.length === 3 || arr.length === 4) {
            return arr;
        }
        else {
            this.retardPlusPlus(msg);
        }
        return [];
    }
}
exports.default = BotService;
