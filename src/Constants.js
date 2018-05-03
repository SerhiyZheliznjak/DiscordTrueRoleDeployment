"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Constants {
    static get OBJECTIVE_FB() { return 'CHAT_MESSAGE_FIRSTBLOOD'; }
    static get JUNGLE_TARGETS_IDENTIFIER() { return 'npc_dota_neutral'; }
    static get DIRE_TOWER_TARGET_IDENTIFIER() { return 'npc_dota_badguys_tower'; }
    static get RADIANT_TOWER_TARGET_IDENTIFIER() { return 'npc_dota_goodguys_tower'; }
    static get MONGODB_URI() { return process.env.MONGODB_URI; }
    static get MONGODB_DB_NAME() { return process.env.MONGODB_URI.split('/').pop(); }
    static get RECENT_MATCHES_COLLECTION() { return 'recentmatches'; }
    static get PLAYERS_COLLECTION() { return 'players'; }
    static get HALL_OF_FAME_COLLECTION() { return 'halloffame'; }
    static get UNCLAIMED() { return 0; }
    static get WON() { return 'ЗАТАЩИВ'; }
    static get LOST() { return 'ТІМА ДНО'; }
    static get AM_HP() { return 640; }
    static get WINNING_MATCH_ID() { return '686'; }
    static get FORGIVE_RETARDS_INTERVAL() { return 1000 * 60 * 60 * 24; }
    static get NOMINATION_DUE_INTERVAL() { return 1000 * 60 * 60 * 24 * 7 * 4; } // 4 weeks
    static get MATCH_DUE_TIME_SEC() { return 60 * 60 * 24 * 7 * 4; } // 4 weeks
    static get WATCH_INTERVAL() { return 1000 * 60 * 60 * 24; }
}
exports.default = Constants;
