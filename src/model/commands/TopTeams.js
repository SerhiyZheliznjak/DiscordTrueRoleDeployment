"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const DiscordUtils_1 = require("../../utils/DiscordUtils");
class TopTeams extends Command_1.CommandBase {
    constructor() {
        super(...arguments);
        this.defaultN = 5;
        this.nameText = 'Команда';
        this.winrateText = 'Вінрейт';
        this.sumText = 'Матчів';
    }
    process(msg) {
        if (!this.isLocked(msg)) {
            this.dataStore.getTeams().subscribe(teams => {
                const digits = this.getArgs(msg.content.toLowerCase()).find(arg => /\d+/.test(arg));
                let numberOfTeams = !digits ? this.defaultN : +digits.match(/\d+/)[0];
                const topTeams = teams.slice(0, numberOfTeams);
                const maxNameLength = Math.max(...(topTeams.map((t, index) => {
                    const placeText = this.getPlaceText(index);
                    return t.name.length + placeText.length;
                })));
                if (maxNameLength > this.nameText.length) {
                    this.nameText = DiscordUtils_1.DiscordUtils.fillWithSpaces(this.nameText, maxNameLength);
                }
                const message = topTeams.reduce((msg, team) => {
                    const winrate = DiscordUtils_1.DiscordUtils.getPercentString(Math.round(team.wins / (team.losses + team.wins) * 10000) / 100);
                    return msg + DiscordUtils_1.DiscordUtils.fillWithSpaces(this.getPlaceText(topTeams.indexOf(team)) + team.name, this.nameText.length) + ' | '
                        + DiscordUtils_1.DiscordUtils.fillWithSpaces(String(winrate), this.winrateText.length) + ' | ' + team.losses + team.wins + '\n';
                }, '');
                this.sendMessage(msg, message.split('\n'), 0);
                if (!this.hasNaVi(topTeams)) {
                    msg.channel.send('```cs\n#НАВІ В КАНАВІ```');
                }
            });
        }
    }
    sendMessage(msg, message, lastIndex) {
        if (message.join('\n').length > 1994 - this.getTableHead().length) {
            let part = '';
            let i = lastIndex;
            while ((part + message[i]).length < 1994 - this.getTableHead().length) {
                part += message[i] + '\n';
                i++;
            }
            msg.channel.send(this.wrapMessage(part));
            this.sendMessage(msg, message.slice(i), i);
        }
        else {
            msg.channel.send(this.wrapMessage(message.join('\n')));
        }
    }
    getTableHead() {
        return this.nameText + ' | ' + this.winrateText + ' | ' + this.sumText + '\n';
    }
    wrapMessage(message) {
        return '```' + this.getTableHead() + message + '```';
    }
    trimMessage(msg) {
        return msg.length < 2000 ? msg : msg.slice(0, 1990) + '```';
    }
    hasNaVi(topTeams) {
        return !!topTeams.find(t => t.team_id === 36);
    }
    getPlaceText(index) {
        return index + 1 + '. ';
    }
    helpText() {
        return 'Повертає топ N професійних команд, N = ' + this.defaultN + ' за замовчуванням';
    }
}
exports.TopTeams = TopTeams;
