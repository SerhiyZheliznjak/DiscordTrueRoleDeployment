"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const DataStore_1 = require("./DataStore");
const ScoreBoard_1 = require("../model/ScoreBoard");
const DotaApi_1 = require("../dota-api/DotaApi");
const Constants_1 = require("../Constants");
const PlayerRecentMatches_1 = require("../model/PlayerRecentMatches");
const PlayerFullMatches_1 = require("../model/PlayerFullMatches");
const NominationUtils_1 = require("../utils/NominationUtils");
class NominationService {
    constructor(dataStore = new DataStore_1.default(), dotaApi = new DotaApi_1.default(), nominationUtils = new NominationUtils_1.default()) {
        this.dataStore = dataStore;
        this.dotaApi = dotaApi;
        this.nominationUtils = nominationUtils;
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
            const freshMatches = recentMatches.filter(rm => this.nominationUtils.isFreshMatch(rm)).map(m => m.match_id);
            return new PlayerRecentMatches_1.default(account_id, freshMatches);
        });
    }
    nextCheck() {
        rxjs_1.Observable.from(this.dotaIds)
            .flatMap((account_id) => rxjs_1.Observable.zip(this.getFreshRecentMatchesForPlayer(account_id), this.dataStore.getRecentMatchesForPlayer(account_id)))
            .map((playerMatches) => {
            const newMatches = this.nominationUtils.getNewMatches(playerMatches[0], playerMatches[1]);
            this.dataStore.updatePlayerRecentMatch(newMatches.account_id, newMatches.recentMatchesIds);
            return newMatches;
        })
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
            .reduce((pfm, match) => this.nominationUtils.getPlayerFullMatches(pfm, match), new PlayerFullMatches_1.default(prm.account_id, []));
    }
    countResults(playersMatches) {
        this.dataStore.hallOfFame.subscribe(hallOfFame => {
            const scoreBoard = new ScoreBoard_1.default();
            playersMatches.forEach(pfm => scoreBoard.scorePlayer(pfm.account_id, pfm.matches));
            const newNominationsClaimed = this.nominationUtils.getNewRecords(hallOfFame, scoreBoard.nominationsResults);
            if (!!newNominationsClaimed.length) {
                this.awardWinners(newNominationsClaimed);
            }
        });
    }
    awardWinners(newNominationsClaimed) {
        for (const nominationResult of newNominationsClaimed) {
            this.dataStore.updateNominationResult(nominationResult);
        }
        this.claimedNominationsObserver.next(newNominationsClaimed);
    }
}
exports.default = NominationService;
