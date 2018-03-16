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
        console.log('Initialized NominationService');
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
    getFreshRecentMatchesForPlayer(account_id) {
        return this.dotaApi.getRecentMatches(account_id).map(recentMatches => {
            const freshMatches = recentMatches.filter(rm => this.isFreshMatch(rm)).map(m => m.match_id);
            return new PlayerRecentMatches_1.default(account_id, freshMatches);
        });
    }
    nextCheck() {
        rxjs_1.Observable.from(this.dotaIds)
            .flatMap((account_id) => rxjs_1.Observable.zip(this.getFreshRecentMatchesForPlayer(account_id), this.dataStore.getRecentMatchesForPlayer(account_id)))
            .map((playerMatches) => this.getNewMatches(playerMatches[0], playerMatches[1]))
            .flatMap(playerWithNewMatches => this.mapToPlayerWithFullMatches(playerWithNewMatches))
            .reduce((arr, pfm) => [...arr, pfm], [])
            .subscribe((playersMatches) => this.countResults(playersMatches));
    }
    mapToPlayerWithFullMatches(prm) {
        if (!prm.recentMatchesIds.length) {
            return rxjs_1.Observable.of(new PlayerFullMatches_1.default(prm.account_id, []));
        }
        return rxjs_1.Observable.from(prm.recentMatchesIds)
            .flatMap(match_id => this.dataStore.getMatch(match_id))
            .reduce((pfm, match) => {
            if (match) {
                pfm.matches.push(match);
            }
            return pfm;
        }, new PlayerFullMatches_1.default(prm.account_id, []));
    }
    isFreshMatch(recentMatch) {
        const nowInSeconds = new Date().getTime() / 1000;
        return nowInSeconds - recentMatch.start_time < Constants_1.default.MATCH_DUE_TIME_SEC;
    }
    hasNewMatches(freshMatches, storedMatches) {
        let hasNewMatch = false;
        if (this.noMatches(storedMatches)) {
            hasNewMatch = !this.noMatches(freshMatches);
        }
        else {
            if (!this.noMatches(freshMatches)) {
                hasNewMatch = this.freshMatchesNotStored(freshMatches, storedMatches);
            }
        }
        return hasNewMatch;
    }
    noMatches(playerMatches) {
        return !playerMatches || !playerMatches.recentMatchesIds || !playerMatches.recentMatchesIds.length;
    }
    freshMatchesNotStored(freshMatches, storedMatches) {
        const notStored = freshMatches.recentMatchesIds.filter(match_id => storedMatches.recentMatchesIds.indexOf(match_id) < 0);
        return notStored.length > 0;
    }
    getNewMatches(freshMatches, storedMatches) {
        if (this.hasNewMatches(freshMatches, storedMatches)) {
            this.dataStore.updatePlayerRecentMatch(freshMatches.account_id, freshMatches.recentMatchesIds);
            return freshMatches;
        }
        return new PlayerRecentMatches_1.default(freshMatches.account_id, []);
    }
    countResults(playersMatches) {
        const scoreBoard = new ScoreBoard_1.default();
        playersMatches.forEach(pfm => scoreBoard.scorePlayer(pfm.account_id, pfm.matches));
        this.dataStore.hallOfFame.subscribe(hallOfFame => {
            const newNominationsClaimed = [];
            for (const nominationName of scoreBoard.nominationsResults.keys()) {
                const newWinner = scoreBoard.nominationsResults.get(nominationName);
                if (newWinner.account_id !== Constants_1.default.UNCLAIMED && newWinner.nomination.isScored()) {
                    const storedWinner = hallOfFame.get(nominationName);
                    if (this.isClaimedNomination(newWinner, storedWinner)) {
                        newNominationsClaimed.push(newWinner);
                    }
                }
            }
            this.awardWinners(newNominationsClaimed);
        });
    }
    awardWinners(newNominationsClaimed) {
        if (!!newNominationsClaimed.length) {
            for (const nominationResult of newNominationsClaimed) {
                this.dataStore.updateNominationResult(nominationResult);
            }
            this.claimedNominationsObserver.next(newNominationsClaimed);
        }
    }
    isClaimedNomination(newWinner, storedWinner) {
        return !storedWinner || this.isOutOfDueDate(storedWinner)
            || newWinner.nomination.hasHigherScoreThen(storedWinner.nomination);
    }
    isOutOfDueDate(storedWinner) {
        return new Date().getTime() - storedWinner.nomination.timeClaimed >= Constants_1.default.NOMINATION_DUE_INTERVAL;
    }
}
exports.default = NominationService;
