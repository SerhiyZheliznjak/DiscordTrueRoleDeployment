"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const NominationService_1 = require("./NominationService");
const CommandsProcessor_1 = require("./CommandsProcessor");
const CreatorCommand_1 = require("../model/commands/CreatorCommand");
const DiscordUtils_1 = require("../utils/DiscordUtils");
class BotService {
    constructor(client, nominationService = new NominationService_1.default()) {
        this.client = client;

        this.nominationService = nominationService;
        this.chanel = this.client.channels.find('type', 'text');
        this.commandsProcessor = new CommandsProcessor_1.CommandsProcessor(this.client, this.nominationService);

    }
    processMesage(msg) {
        this.commandsProcessor.onMessage(msg);
    }
}
exports.default = BotService;
