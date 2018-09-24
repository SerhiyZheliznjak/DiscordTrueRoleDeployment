"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Nomination {
    constructor(points = [], timeClaimed = new Date().getTime()) {
        this.points = points;
        this.timeClaimed = timeClaimed;
    }
    getKey() {
        return this.name.split("").reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
    }
    getName() {
        return this.name;
    }
    scoreMatch(match, player_slot) {
        this.addPoint(match.match_id, this.scorePoint(match, player_slot));
    }
    addPoint(match_id, point) {
        this.points.push([match_id, point]);
        while (this.points.length > 20) {
            this.points.shift();
        }
    }
    getPoints() {
        return this.points;
    }
    getScore() {
        return this.points.reduce((r, p) => {
            return p != null && p[0] != null ? r + parseInt(p[1] + '') : r;
        }, 0);
    }
    scoreToString() {
        return this.getScore() + '';
    }
    getMessage() {
        return this.msg;
    }
    compare(that) {
        return that.getScore() - this.getScore();
    }
    isScored() {
        return this.getScore() >= this.minScore;
    }
    getScoreText() {
        throw new Error('Should be implemented by child classes');
    }
    getScoreDescription() {
        throw new Error('Should be implemented by child classes');
    }
    getThumbURL() {
        throw new Error('Should be implemented by child classes');
    }
    scorePoint(match, player_slot) {
        throw new Error('Should be implemented by child classes');
    }
}
exports.default = Nomination;
