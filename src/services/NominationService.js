"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const DataStore_1 = require("./DataStore");
const ScoreBoard_1 = require("../model/ScoreBoard");
const DotaApi_1 = require("../dota-api/DotaApi");
const Constants_1 = require("../Constants");
const PlayerRecentMatches_1 = require("../model/PlayerRecentMatches");
const PlayerFullMatches_1 = require("../model/PlayerFullMatches");
class NominationService {
    constructor(dataStore = new DataStore_1.default(), dotaApi = new DotaApi_1.default()) {
        this.dataStore = dataStore;
        this.dotaApi = dotaApi;
        this.recentGamesObserver = {
            next: () => this.nextCheck(),
            error: () => { },
            complete: () => { }
        };
    }
    startNominating(playersMap) {
        DataStore_1.default.maxMatches = playersMap.size * 20;
        this.dotaIds = this.getDotaIds(playersMap);
        this.subscription = rxjs_1.Observable.interval(Constants_1.default.WATCH_INTERVAL).subscribe(this.recentGamesObserver);
        this.recentGamesObserver.next(0);
        return rxjs_1.Observable.create(claimedNominationsObserver => this.claimedNominationsObserver = claimedNominationsObserver);
    }
    stopNominating() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        console.log('stopped nominating');
    }
    getDotaIds(playersMap) {
        const dotaIds = [];
        for (const id of playersMap.keys()) {
            dotaIds.push(id);
        }
        return dotaIds;
    }
    getRecentMatchesForPlayer(account_id) {
        return this.dotaApi.getRecentMatches(account_id).map(recentMatches => {
            const freshMatches = recentMatches.filter(rm => this.isFreshMatch(rm)).map(m => m.match_id);
            this.dataStore.updatePlayerRecentMatch(account_id, freshMatches);
            return new PlayerRecentMatches_1.default(account_id, freshMatches);
        });
    }
    nextCheck() {
        const scoreBoard = new ScoreBoard_1.default();
        rxjs_1.Observable.from(this.dotaIds)
            .flatMap((account_id) => rxjs_1.Observable.zip(this.dataStore.getRecentMatchesForPlayer(account_id), this.getRecentMatchesForPlayer(account_id)))
            .filter((playerMatches) => this.hasNewMatches(...playerMatches))
            .flatMap(playersWithNewMatches => this.mapToPlayerWithFullMatches(playersWithNewMatches[1]))
            .scan((arr, pfm) => [...arr, pfm], [])
            .scan((arr, pfms) => [...arr, pfms], [])
            .subscribe(playersMatches => {
            playersMatches.forEach(pfms => pfms.forEach(pfm => scoreBoard.scorePlayer(pfm.account_id, pfm.matches)));
            this.awardWinners(scoreBoard);
        });
    }
    mapToPlayerWithFullMatches(prm) {
        return rxjs_1.Observable.from(prm.recentMatchesIds)
            .flatMap(match_id => this.dataStore.getMatch(match_id))
            .scan((pfm, match) => {
            pfm.matches.push(match);
            return pfm;
        }, new PlayerFullMatches_1.default(prm.account_id, []));
    }
    isFreshMatch(recentMatch) {
        const nowInSeconds = new Date().getTime() / 1000;
        return nowInSeconds - recentMatch.start_time < Constants_1.default.MATCH_DUE_TIME_SEC;
    }
    hasNewMatches(storedPlayerMatches, newPlayerMatches) {
        return storedPlayerMatches
            && storedPlayerMatches.recentMatchesIds
                .reduce((exist, match_id) => exist || newPlayerMatches.recentMatchesIds.indexOf(match_id) < 0, false);
    }
    awardWinners(scoreBoard) {
        this.dataStore.nominationsResults.subscribe(wonNominations => {
            const newNomintionsClaimed = [];
            for (const nominationName of scoreBoard.nominationsResults.keys()) {
                const newWinner = scoreBoard.nominationsResults.get(nominationName);
                if (newWinner.account_id !== Constants_1.default.UNCLAIMED && newWinner.nomination.isScored()) {
                    const storedWinner = wonNominations.get(nominationName);
                    if (this.isClaimedNomination(newWinner, storedWinner)) {
                        newNomintionsClaimed.push(newWinner);
                    }
                }
            }
            if (!!newNomintionsClaimed.length) {
                for (const nominationResult of scoreBoard.nominationsResults.values()) {
                    this.dataStore.updateNominationResult(nominationResult);
                }
                this.claimedNominationsObserver.next(newNomintionsClaimed);
            }
        });
    }
    isClaimedNomination(newWinner, storedWinner) {
        return !storedWinner
            || newWinner.nomination.hasHigherScoreThen(storedWinner.nomination)
            || this.isOutOfDueDate(newWinner, storedWinner);
    }
    isOutOfDueDate(newWinner, storedWinner) {
        return newWinner.nomination.timeClaimed - storedWinner.nomination.timeClaimed >= Constants_1.default.NOMINATION_DUE_INTERVAL
            && newWinner.account_id !== storedWinner.account_id
            && newWinner.nomination.getScore() !== storedWinner.nomination.getScore();
    }
}
exports.default = NominationService;
