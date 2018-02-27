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
    startWatching(playersMap) {
        DataStore_1.default.maxMatches = playersMap.size * 20;
        this.dotaIds = this.getDotaIds(playersMap);
        this.subscription = rxjs_1.Observable.interval(1000 * 60 * 60).subscribe(this.recentGamesObserver);
        this.recentGamesObserver.next(0);
        return rxjs_1.Observable.create(claimedNominationsObserver => this.claimedNominationsObserver = claimedNominationsObserver);
    }
    stopWatching() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        console.log('stopped watching');
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
            .map(recentMatch => new Pair_1.default(account_id, recentMatch.map(m => m.match_id))))).subscribe(playerRecentMatches => {
            if (this.hasNewMatches(playerRecentMatches)) {
                this.nominate(playerRecentMatches).subscribe(scoreBoard => {
                    this.awardWinners(scoreBoard);
                });
                playerRecentMatches.forEach(p => this.dataStore.updatePlayerRecentMatches(p.key, p.val));
                this.dataStore.saveRecentMatches();
            }
        });
    }
    hasNewMatches(playerRecentMatches) {
        const atLeastOneNewMatch = playerRecentMatches.find(pair => {
            const newMatches = pair.val.filter(match_id => {
                const prm = this.dataStore.playerRecentMatchesCache.get(pair.key);
                return prm ? prm.indexOf(match_id) < 0 : true;
            });
            return newMatches.length > 0;
        });
        return !!atLeastOneNewMatch;
    }
    awardWinners(scoreBoard) {
        const newNomintionsClaimed = [];
        for (const nominationName of scoreBoard.nominationsWinners.keys()) {
            const newWinner = scoreBoard.nominationsWinners.get(nominationName);
            if (newWinner.account_id !== Constants_1.Constants.UNCLAIMED && newWinner.nomination.isScored()) {
                const storedWinner = this.dataStore.wonNominationCache.get(nominationName);
                if (!storedWinner || storedWinner.nomination.getScore() < newWinner.nomination.getScore()) {
                    newNomintionsClaimed.push(newWinner);
                }
            }
        }
        if (!!newNomintionsClaimed.length) {
            console.log('awarding winners ', newNomintionsClaimed.length);
            this.dataStore.saveWinnersScore(scoreBoard.nominationsWinners);
            this.claimedNominationsObserver.next(newNomintionsClaimed);
        }
    }
}
exports.default = NominationService;
