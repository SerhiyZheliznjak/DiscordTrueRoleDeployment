"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rxjs_1 = require("rxjs");
const DataStore_1 = require("./DataStore");
const NominationService_1 = require("./NominationService");
const StorageService_1 = require("./StorageService");
const StorageConvertionUtil_1 = require("../utils/StorageConvertionUtil");
class BotService {
    constructor(client, dataStore = new DataStore_1.default(), nominationService = new NominationService_1.default(), storageService = new StorageService_1.default()) {
        this.client = client;
        this.dataStore = dataStore;
        this.nominationService = nominationService;
        this.storageService = storageService;
        this.retardMap = new Map();
        this.playersMap = StorageConvertionUtil_1.default.convertToPlayerObserved(this.storageService.getPlayersObserved());
        if (this.playersMap.size === 0) {
            this.playersMap.set(298134653, '407971834689093632'); // Dno
            this.playersMap.set(333303976, '407949091163865099'); // Tee Hee
            this.playersMap.set(118975931, '289388465034887178'); // I'm 12 btw GG.BET
            this.playersMap.set(86848474, '408363774257528852'); // whoami
            this.playersMap.set(314684987, '413792999030652938'); // blackRose
            this.playersMap.set(36753317, '408172132875501581'); // =3
        }
        this.chanel = this.client.channels.find('type', 'text');
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
        if (msg.content.toLowerCase().startsWith("watch ")) {
            this.addWatch(msg);
        }
        if (msg.content.toLocaleLowerCase() === 'watchlist') {
            this.showRegistered(msg);
        }
    }
    forgiveRetards() {
        rxjs_1.Observable.interval(1000 * 60 * 60 * 24).subscribe(() => this.retardMap = new Map());
    }
    startNominating() {
        this.claimedNominationsSubscription = this.nominationService.startWatching(this.playersMap)
            .subscribe((newNomintionsClaimed) => {
            this.generateMessages(newNomintionsClaimed).subscribe((richEmbed) => {
                console.log('sending message about ', richEmbed.title);
                this.chanel.send('', richEmbed);
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
            let registered = 'Стежу за: ';
            for (const info of this.playersMap) {
                registered += info + '\n';
            }
            msg.reply(registered);
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
                    if (this.playersMap.get(playerInfo.account_id) && !this.isCreator(msg)) {
                        msg.reply('Вже закріплено за @' + this.playersMap.get(playerInfo.account_id));
                        this.retardPlusPlus(msg);
                    }
                    else {
                        this.watchPlayer(playerInfo.account_id, msg.mentions.users.first().id);
                        msg.reply('Я стежитиму за тобою, ' + playerInfo.personaname);
                    }
                }
                else {
                    msg.reply('Давай ще раз, але цього разу очима дивись на айді гравця');
                    this.retardPlusPlus(msg);
                }
            });
        }
    }
    watchPlayer(account_id, discordId) {
        this.playersMap.set(account_id, discordId);
        this.storageService.savePlayersObserved(this.playersMap);
    }
    isCreator(msg) {
        console.log(msg.author.id);
        return msg.author.id === process.env.creatorId;
    }
    stopNominating() {
        this.nominationService.stopWatching();
        if (this.claimedNominationsSubscription) {
            this.claimedNominationsSubscription.unsubscribe();
        }
        this.storageService.savePlayersObserved(this.playersMap);
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
        return rxjs_1.Observable.create((messagesObserver) => {
            this.getPlayerProfilesSet(claimedNominations).subscribe(players => {
                claimedNominations.forEach(claimed => {
                    const player = players.find(p => +p.account_id === +claimed.account_id);
                    messagesObserver.next(this.getRichEmbed(player.personaname + ' ' + claimed.nomination.getName(), claimed.nomination.getMessage(), player.avatarmedium, 'Рахунок: ' + claimed.nomination.getScoreText(), player.profileurl));
                });
                messagesObserver.complete();
            });
        });
    }
    getPlayerProfilesSet(claimedNominations) {
        return this.dataStore.getPlayers(claimedNominations.map(cn => cn.account_id).reduce((uniq, id) => {
            if (uniq.indexOf(id) < 0) {
                uniq.push(id);
            }
            return uniq;
        }, []));
    }
}
exports.BotService = BotService;
