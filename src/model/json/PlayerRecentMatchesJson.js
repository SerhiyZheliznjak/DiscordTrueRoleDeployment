"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerRecentMatchesJson {
    constructor(account_id, recentMatchesIds) {
        this.account_id = account_id;
        this.recentMatchesIds = recentMatchesIds;
        this.key = this.account_id;
    }
}
exports.default = PlayerRecentMatchesJson;
