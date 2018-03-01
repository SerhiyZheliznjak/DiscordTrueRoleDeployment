"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const DataStore_1 = require("./DataStore");
const Pair_1 = require("../model/Pair");
const ScoreBoard_1 = require("../model/ScoreBoard");
const DotaApi_1 = require("../dota-api/DotaApi");
const Constants_1 = require("../Constants");
class NominationService {
    constructor(dataStore = new DataStore_1.default(), dotaApi = new DotaApi_1.default()) {
        this.dataStore = dataStore;
        this.dotaApi = dotaApi;
        this.recentGamesObserver = {
            next: () => this.recentGamesObserverNext(),
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
    nominate(playerRecentMatches) {
        const scoreBoard = new ScoreBoard_1.default();
        return rxjs_1.Observable.create(scoreBoardObserver => {
            this.getPlayerFullMatches(playerRecentMatches)
                .subscribe(playerFullMatches => {
                playerFullMatches.forEach(ps => scoreBoard.scorePlayer(ps.key, ps.val));
                scoreBoardObserver.next(scoreBoard);
                scoreBoardObserver.complete();
            });
        });
    }
    getPlayerFullMatches(playerRecentMatches) {
        return rxjs_1.Observable.forkJoin(playerRecentMatches.map(p => this.dataStore.getMatches(p.val).map(fullMatches => {
            return new Pair_1.default(p.key, fullMatches);
        })));
    }
    getDotaIds(playersMap) {
        const dotaIds = [];
        for (const id of playersMap.keys()) {
            dotaIds.push(id);
        }
        return dotaIds;
    }
    recentGamesObserverNext() {
        rxjs_1.Observable.forkJoin(this.dotaIds.map(account_id => this.dotaApi.getRecentMatches(account_id)
            .map(recentMatch => new Pair_1.default(account_id, recentMatch
            .filter(rm => this.isFreshMatch(rm))
            .map(m => m.match_id))))).subscribe(playerRecentMatches => {
            this.hasNewMatches(playerRecentMatches).subscribe(newMatchesHappend => {
                if (newMatchesHappend) {
                    this.nominate(playerRecentMatches).subscribe(scoreBoard => {
                        this.awardWinners(scoreBoard);
                    });
                    playerRecentMatches.forEach(p => this.dataStore.updatePlayerRecentMatches(p.key, p.val));
                }
            });
        });
    }
    isFreshMatch(recentMatch) {
        const now = (new Date().getTime() / 1000);
        console.log('recentMatch.start_time: ', recentMatch.start_time);
        console.log('now: ', now);
        console.log('difference: ', now - recentMatch.start_time);
        return now - recentMatch.start_time < Constants_1.default.MATCH_DUE_TIME_SEC;
    }
    hasNewMatches(playerRecentMatches) {
        return this.dataStore.playersRecentMatches.map(recentMatches => {
            const atLeastOneNewMatch = playerRecentMatches.find(pair => {
                const newMatches = pair.val.filter(match_id => {
                    const prm = recentMatches.get(pair.key);
                    return prm ? prm.indexOf(match_id) < 0 : true;
                });
                return newMatches.length > 0;
            });
            return !!atLeastOneNewMatch;
        });
    }
    awardWinners(scoreBoard) {
        this.dataStore.wonNominations.subscribe(wonNominations => {
            const newNomintionsClaimed = [];
            for (const nominationName of scoreBoard.nominationsWinners.keys()) {
                const newWinner = scoreBoard.nominationsWinners.get(nominationName);
                if (newWinner.account_id !== Constants_1.default.UNCLAIMED && newWinner.nomination.isScored()) {
                    const storedWinner = wonNominations.get(nominationName);
                    if (this.isClaimedNomination(newWinner, storedWinner)) {
                        newNomintionsClaimed.push(newWinner);
                    }
                }
            }
            if (!!newNomintionsClaimed.length) {
                this.dataStore.saveWinnersScore(scoreBoard.nominationsWinners);
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
