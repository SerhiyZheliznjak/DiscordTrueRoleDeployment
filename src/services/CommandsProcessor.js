"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../model/Command");
const ShowTop_1 = require("../model/commands/ShowTop");
const Register_1 = require("../model/commands/Register");
const rxjs_1 = require("rxjs");
const Constants_1 = require("../Constants");
const RegisterAll_1 = require("../model/commands/RegisterAll");
const WatchList_1 = require("../model/commands/WatchList");
const NominationKeysReminder_1 = require("../model/commands/NominationKeysReminder");
class CommandsProcessor extends Command_1.CommandBase {
    constructor() {
        super(...arguments);
        this.commandMap = new Map();
    }
    addCommand(command, processor) {
        this.commandMap.set(command, processor);
    }
    getCommandParser(msg) {
        const commandName = this.parseCommandName(msg.content);
        if (!this.commandMap.get(commandName)) {
            this.init();
        }
        return this.commandMap.get(commandName);
    }
    onMessage(msg) {
        if (this.isBot(msg)) {
            return;
        }
        if (this.isRetard(msg.author.id)) {
            this.shutUpYouRRetard(msg);
            return;
        }
        const processor = this.getCommandParser(msg);
        if (processor) {
            processor.process(msg);
        }
    }
    process(msg) {
        const commands = [...this.commandMap].map(p => p[0]).sort().join('\n');
        msg.reply(commands);
    }
    forgiveRetards() {
        rxjs_1.Observable.interval(Constants_1.default.FORGIVE_RETARDS_INTERVAL).subscribe(() => Command_1.CommandBase.retardMap = new Map());
    }
    isBot(message) {
        return message.author.bot;
    }
    parseCommandName(content) {
        return content.split(' ')[0].substring(1).toLowerCase();
    }
    init() {
        this.commandMap.set('register', new Register_1.Register(this.client, this.dataStore));
        this.commandMap.set('top', new ShowTop_1.ShowTop(this.client, this.dataStore));
        this.commandMap.set('commands', this);
        this.commandMap.set('registerall', new RegisterAll_1.RegisterAll(this.client, this.dataStore));
        this.commandMap.set('watchlist', new WatchList_1.WatchList(this.client, this.dataStore));
        this.commandMap.set('nominationkeys', new NominationKeysReminder_1.NominationKeysReminder(this.client, this.dataStore));
        this.forgiveRetards();
    }
}
exports.CommandsProcessor = CommandsProcessor;