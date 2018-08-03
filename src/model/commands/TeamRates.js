"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../Command");
class TeamRates extends Command_1.CommandBase {
    process(msg) {
        if (!this.isLocked(msg)) {
            this.dataStore.getTeams().subscribe(teams => {
                const digits = this.getArgs(msg.content.toLowerCase()).find(arg => /\d+/.test(arg));
                const n = !digits ? 10 : +digits.match(/\d+/)[0];
                const message = teams.slice(0, n).reduce((msg, team) => {
                    const winrate = Math.round(team.wins / (team.losses + team.wins) * 10000) / 100;
                    return msg + winrate + '% | ' + team.losses + team.wins + ' | ' + team.name + '\n';
                }, '```Вінрейт | Матчів | Команда\n');
                msg.channel.send(message + '```');
            });
        }
    }
    helpText() {
        return 'Повертає топ N професійних команд, N = 10 за замовчуванням';
    }
}
exports.TeamRates = TeamRates;
