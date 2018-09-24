"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Constants {
    static get MONGODB_URI() { return process.env.MONGODB_URI; }
    static get MONGODB_DB_NAME() { return process.env.MONGODB_URI.split('/').pop(); }
    static get RECENT_MATCHES_COLLECTION() { return 'recentmatches'; }
    static get PLAYERS_COLLECTION() { return 'players'; }
    static get HALL_OF_FAME_COLLECTION() { return 'halloffame'; }
    static get UNCLAIMED() { return 0; }
    static get WON() { return 'ЗАТАЩИВ'; }
    static get LOST() { return 'ТІМА ДНО'; }
    static get AM_HP() { return 640; }
    static get FORGIVE_RETARDS_INTERVAL() { return 1000 * 60 * 60 * 24; }
    static get NOMINATION_DUE_INTERVAL() { return parseInt(process.env.NOMINATION_DUE_INTERVAL); }
    static get MATCH_DUE_TIME_DAYS() { return parseInt(process.env.MATCH_DUE_TIME_DAYS); }
    static get WATCH_INTERVAL() { return parseInt(process.env.WATCH_INTERVAL); }
}
exports.default = Constants;
