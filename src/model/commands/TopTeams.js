"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const DiscordUtils_1 = require("../../utils/DiscordUtils");
class TopTeams extends Command_1.CommandBase {
    constructor() {
        super(...arguments);
        this.defaultN = 5;
    }
    process(msg) {
        if (!this.isLocked(msg)) {
            this.dataStore.getTeams().subscribe(teams => {
                const digits = this.getArgs(msg.content.toLowerCase()).find(arg => /\d+/.test(arg));
                let numberOfTeams = !digits ? this.defaultN : +digits.match(/\d+/)[0];
                numberOfTeams = Math.min(numberOfTeams, teams.length);
                const topTeams = teams.slice(0, numberOfTeams);
                const maxNameLength = Math.max(...(topTeams.map((t, index) => {
                    const placeText = this.getPlaceText(index);
                    return t.name.length + placeText.length;
                })));
                let nameText = 'Команда';
                const winrateText = 'Вінрейт';
                const sumText = 'Матчів';
                if (maxNameLength > nameText.length) {
                    nameText = DiscordUtils_1.DiscordUtils.fillWithSpaces(nameText, maxNameLength);
                }
                const message = topTeams.reduce((msg, team) => {
                    const winrate = DiscordUtils_1.DiscordUtils.getPercentString(Math.round(team.wins / (team.losses + team.wins) * 10000) / 100);
                    return msg + DiscordUtils_1.DiscordUtils.fillWithSpaces(this.getPlaceText(topTeams.indexOf(team)) + team.name, nameText.length) + ' | '
                        + DiscordUtils_1.DiscordUtils.fillWithSpaces(String(winrate), winrateText.length) + ' | ' + team.losses + team.wins + '\n';
                }, '```' + nameText + ' | ' + winrateText + ' | ' + sumText + '\n');
                msg.channel.send(message + '```');
                // if (this.hasNaVi(topTeams)) {
                //     msg.channel.send('```cs#НАВІ В КАНАВІ```');
                // }
            });
        }
    }
    // private hasNaVi(topTeams: TeamJson[]): boolean {
    //     return !!topTeams.find(t => t.team_id === 36);
    // }
    getPlaceText(index) {
        return index + 1 + '. ';
    }
    helpText() {
        return 'Повертає топ N професійних команд, N = ' + this.defaultN + ' за замовчуванням';
    }
}
exports.TopTeams = TopTeams;
