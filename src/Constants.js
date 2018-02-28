"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Constants {
    static get OBJECTIVE_FB() { return 'CHAT_MESSAGE_FIRSTBLOOD'; }
    static get JUNGLE_TARGETS_IDENTIFIER() { return 'npc_dota_neutral'; }
    static get DIRE_TOWER_TARGET_IDENTIFIER() { return 'npc_dota_badguys_tower'; }
    static get RADIANT_TOWER_TARGET_IDENTIFIER() { return 'npc_dota_goodguys_tower'; }
    static get RECENT_MATCHES() { return './storage/recent-matches.json'; }
    static get PLAYERS_FILE_PATH() { return './storage/players.json'; }
    static get WINNERS_FILE_PATH() { return './storage/winners.json'; }
    static get UNCLAIMED() { return 0; }
    static get WON() { return 'ЗАТАЩИВ'; }
    static get LOST() { return 'ТІМА ДНО'; }
    static get AM_HP() { return 640; }
    static get WINNING_MATCH_ID() { return '686'; }
    static get FORGIVE_RETARDS_INTERVAL() { return 1000 * 60 * 60 * 24; }
    static get NOMINATION_DUE_INTERVAL() { return 1000 * 60 * 60 * 24 * 7 - 1000 * 60; } // -1000*60 huge gap for calculations
    static get MATCH_DUE_TIME_SEC() { return 60 * 60 * 24 * 7; } // -1000*60 huge gap for calculations
    static get WATCH_INTERVAL() { return 1000 * 60 * 60 * 24; }
}
exports.Constants = Constants;