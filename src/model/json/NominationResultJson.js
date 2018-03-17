"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NominationResultJson {
    constructor(key, nominationName, owner_account_id, score, timeClaimed) {
        this.key = key;
        this.nominationName = nominationName;
        this.owner_account_id = owner_account_id;
        this.score = score;
        this.timeClaimed = timeClaimed;
    }
}
exports.default = NominationResultJson;
