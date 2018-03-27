"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandBase {
    isCreator(message) {
        return message.author.id === process.env.creatorId;
    }
    getCommand(content) {
        return content.split(' ')[0].substring(1).toLowerCase();
    }
    getArgs(content) {
        return content.split(' ').slice(1);
    }
    random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    randomItem(items) {
        return items[this.random(0, items.length)];
    }
}
exports.CommandBase = CommandBase;
