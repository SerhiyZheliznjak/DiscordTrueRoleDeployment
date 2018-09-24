"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataStore_1 = require("./DataStore");
const NominationService_1 = require("./NominationService");
const CommandsProcessor_1 = require("./CommandsProcessor");
const CreatorCommand_1 = require("../model/commands/CreatorCommand");
const DiscordUtils_1 = require("../utils/DiscordUtils");
class BotService {
    constructor(client, dataStore = new DataStore_1.default(), nominationService = new NominationService_1.default()) {
        this.client = client;
        this.dataStore = dataStore;
        this.nominationService = nominationService;
        this.chanel = this.client.channels.find('type', 'text');
        this.commandsProcessor = new CommandsProcessor_1.CommandsProcessor(this.client, this.dataStore, this.nominationService);
        this.commandsProcessor.addCommand('restart', new CreatorCommand_1.CreatorCommand(this.client, this.dataStore, msg => this.restart(msg)));
    }
    processMesage(msg) {
        this.commandsProcessor.onMessage(msg);
    }
    startNominating() {
        this.dataStore.registeredPlayers.subscribe(playersMap => {
            this.claimedNominationsSubscription = this.nominationService.startNominating(playersMap)
                .subscribe((newNominationsClaimed) => {
                DiscordUtils_1.DiscordUtils.generateMessages(newNominationsClaimed, this.dataStore).subscribe((richEmbed) => {
                    this.chanel.send('', richEmbed);
                });
            });
        });
    }
    restart(msg) {
        this.stopNominating();
        this.startNominating();
    }
    stopNominating() {
        this.nominationService.stopNominating();
        if (this.claimedNominationsSubscription) {
            this.claimedNominationsSubscription.unsubscribe();
        }
    }
}
exports.default = BotService;
