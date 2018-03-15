"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NominationResultJson {
    constructor(nominationName, owner_account_id, score, timeClaimed) {
        this.nominationName = nominationName;
        this.owner_account_id = owner_account_id;
        this.score = score;
        this.timeClaimed = timeClaimed;
        this.key = nominationName.split("").reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
    }
}
exports.default = NominationResultJson;
