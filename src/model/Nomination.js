"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Pair_1 = require("./Pair");
class Nomination {
    constructor(points = []) {
        this.points = points;
        this.timeClaimed = new Date().getTime();
    }
    getName() {
        return this.name;
    }
    scoreMatch(match, player_slot) {
        this.addPoint(match.match_id, this.scorePoint(match, player_slot));
    }
    addPoint(match_id, point) {
        this.points.push(new Pair_1.default(match_id, point));
        while (this.points.length > 20) {
            this.points.shift();
        }
    }
    getPoints() {
        return this.points;
    }
    getScore() {
        return this.points.reduce((r, p) => {
            return p != null && p.p2 != null ? r + parseInt(p.p2 + '') : r;
        }, 0);
    }
    getScoreText() {
        return '' + this.getScore();
    }
    getMessage() {
        return this.msg;
    }
    hasHigherScoreThen(that) {
        return this.getScore() > that.getScore();
    }
    isScored() {
        return this.getScore() >= this.minScore;
    }
    scorePoint(match, player_slot) {
        return null;
    }
}
exports.default = Nomination;
