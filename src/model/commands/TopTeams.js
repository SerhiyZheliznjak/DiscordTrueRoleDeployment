"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
const DiscordUtils_1 = require("../../utils/DiscordUtils");
class TopTeams extends Command_1.CommandBase {
    process(msg) {
        if (!this.isLocked(msg)) {
            this.dataStore.getTeams().subscribe(teams => {
                const digits = this.getArgs(msg.content.toLowerCase()).find(arg => /\d+/.test(arg));
                const n = !digits ? 10 : +digits.match(/\d+/)[0];
                const topTeams = teams.slice(0, n);
                const maxNameLength = Math.max(...(topTeams.map(t => t.name.length)));
                const message = topTeams.reduce((msg, team) => {
                    const winrate = DiscordUtils_1.DiscordUtils.getPercentString(Math.round(team.wins / (team.losses + team.wins) * 10000) / 100);
                    return msg + DiscordUtils_1.DiscordUtils.fillWithSpaces(String(team.name), Math.max(maxNameLength, 7)) + ' | '
                        + DiscordUtils_1.DiscordUtils.fillWithSpaces(String(winrate), 7) + ' | ' + team.losses + team.wins + '\n';
                }, '```Команда | Вінрейт | Матчів\n');
                msg.channel.send(message + '```');
            });
        }
    }
    helpText() {
        return 'Повертає топ N професійних команд, N = 10 за замовчуванням';
    }
}
exports.TopTeams = TopTeams;
