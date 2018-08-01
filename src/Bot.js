"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const BotService_1 = require("./services/BotService");
const client = new discord_js_1.Client();
let botService;
client.login(process.env.token);
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    botService = new BotService_1.default(client);
    botService.startNominating();
});
client.on('message', msg => {
    botService.processMesage(msg);
});
