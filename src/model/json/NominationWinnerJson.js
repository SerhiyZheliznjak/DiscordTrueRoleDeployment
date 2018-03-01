"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NominationWinnerJson {
    constructor(nominationName, owner_account_id, score, timeClaimed) {
        this.nominationName = nominationName;
        this.owner_account_id = owner_account_id;
        this.score = score;
        this.timeClaimed = timeClaimed;
        this.key = nominationName;
    }
}
exports.default = NominationWinnerJson;
