"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
class CreatorCommand extends Command_1.CommandBase {
    constructor(client, dataStore, processCb) {
        super(client, dataStore);
        this.processCb = processCb;
    }
    process(msg) {
        if (this.isCreator(msg)) {
            this.processCb(msg);
        }
        else {
            this.retardPlusPlus(msg);
            msg.reply('ти того бота писав щоб таке з ним робити?');
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
exports.CreatorCommand = CreatorCommand;
