"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandBase {
    constructor(client, dataStore) {
        this.client = client;
        this.dataStore = dataStore;
    }
    isCreator(message) {
        return message.author.id === process.env.creatorId;
    }
    getArgs(content) {
        return content.split(' ').slice(1);
    }
    isRetard(authorId) {
        const retardCount = CommandBase.retardMap.get(authorId);
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
    shutUpYouRRetard(msg) {
        const shutRetard = ['Стягнув', 'Ти такий розумний', 'Помовчи трохи', 'Т-с-с-с-с-с-с',
            'Біжи далеко', 'Ти можеш трохи тихо побути?', 'Ціхо', 'Каца!', 'Таааась тась тась',
            'Люди, йдіть сі подивіть', 'Інколи краще жувати', 'Ти то серйозно?', 'Молодець'];
        msg.reply(shutRetard[Math.floor(Math.random() * shutRetard.length)]);
    }
    retardPlusPlus(msg) {
        const authorId = msg.author.id;
        if (!CommandBase.retardMap.get(authorId)) {
            CommandBase.retardMap.set(authorId, []);
        }
        const retardCount = CommandBase.retardMap.get(authorId);
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
}
CommandBase.retardMap = new Map();
exports.CommandBase = CommandBase;
