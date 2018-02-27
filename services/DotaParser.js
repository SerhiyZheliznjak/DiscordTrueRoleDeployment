"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DotaParser {
    static getPlayerInfo(match, player_slot) {
        return !!match ? match.players.find(player => player.player_slot === player_slot) : undefined;
    }
    static getObjectives(match) {
        return !!match ? match.objectives : undefined;
    }
    static getPlayerSlot(match, account_id) {
        const player = match.players.find(p => p.account_id === account_id);
        if (player) {
            return player.player_slot;
        }
    }
}
exports.DotaParser = DotaParser;
