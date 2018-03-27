"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const DataStore_1 = require("./DataStore");
const Nominations_1 = require("../model/Nominations");
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
            next: () => this.nextCheck(this.dotaIds),
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
    getTopN(nominationClassName, n = 3) {
        if (!Nominations_1.default.getByClassName(nominationClassName)) {
            console.log('no such nomination className: ', nominationClassName);
            return;
        }
        const nominationKey = Nominations_1.default.getByClassName(nominationClassName).getKey();
        if (this.scoreBoard && this.scoreBoard.hasScores(nominationKey)) {
            console.log('using scored scoreboard');
            return rxjs_1.Observable.of(this.scoreBoard.getTopN(n).get(nominationKey));
        }
        else {
            console.log('getting new scoreboard');
            rxjs_1.Observable.from(this.dotaIds)
                .flatMap((account_id) => this.getFreshRecentMatchesForPlayer(account_id))
                .flatMap((playerWithNewMatches) => this.mapToPlayerWithFullMatches(playerWithNewMatches))
                .reduce((arr, pfm) => [...arr, pfm], []).map(playersMatches => {
                this.scoreBoard = new ScoreBoard_1.default();
                playersMatches.forEach(pfm => this.scoreBoard.scorePlayer(pfm.account_id, pfm.matches));
                return this.scoreBoard.getTopN(n).get(nominationKey);
            });
        }
    }
    stopNominating() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        console.log('stopped nominating');
    }
    mapRecentMatchesToNew(recentMatches, storedMatches) {
        const newMatches = this.nominationUtils.getNewMatches(recentMatches, storedMatches);
        if (newMatches.recentMatchesIds.length) {
            this.dataStore.updatePlayerRecentMatch(newMatches.account_id, newMatches.recentMatchesIds);
        }
        return newMatches;
    }
    mapToPlayerWithFullMatches(prm) {
        if (!prm.recentMatchesIds.length) {
            return rxjs_1.Observable.of(new PlayerFullMatches_1.default(prm.account_id, []));
        }
        return rxjs_1.Observable.from(prm.recentMatchesIds)
            .flatMap(match_id => this.dataStore.getMatch(match_id))
            .reduce((pfm, match) => this.nominationUtils.getPlayerFullMatches(pfm, match), new PlayerFullMatches_1.default(prm.account_id, []));
    }
    getFreshRecentMatchesForPlayer(account_id) {
        return this.dotaApi.getRecentMatches(account_id).map(recentMatches => {
            const freshMatches = recentMatches.filter(rm => this.nominationUtils.isFreshMatch(rm)).map(m => m.match_id);
            return new PlayerRecentMatches_1.default(account_id, freshMatches);
        });
    }
    getNewResults(playersMatches, hallOfFame) {
        this.scoreBoard = new ScoreBoard_1.default();
        playersMatches.forEach(pfm => this.scoreBoard.scorePlayer(pfm.account_id, pfm.matches));
        return this.nominationUtils.getNewRecords(hallOfFame, this.scoreBoard.getFirstPlaces());
    }
    awardWinners(newNominationsClaimed) {
        for (const nominationResult of newNominationsClaimed) {
            this.dataStore.updateNominationResult(nominationResult);
        }
        this.claimedNominationsObserver.next(newNominationsClaimed);
    }
    nextCheck(dotaIds) {
        this.getPlayerFullMatches(dotaIds)
            .subscribe((playersMatches) => {
            this.dataStore.hallOfFame.subscribe(hallOfFame => {
                const newNominationsClaimed = this.getNewResults(playersMatches, hallOfFame);
                if (!!newNominationsClaimed.length) {
                    this.awardWinners(newNominationsClaimed);
                }
            });
        });
    }
    getPlayerFullMatches(dotaIds) {
        return rxjs_1.Observable.from(dotaIds)
            .flatMap((account_id) => rxjs_1.Observable.zip(this.getFreshRecentMatchesForPlayer(account_id), this.dataStore.getRecentMatchesForPlayer(account_id)))
            .map((playerMatches) => this.mapRecentMatchesToNew(playerMatches[0], playerMatches[1]))
            .flatMap((playerWithNewMatches) => this.mapToPlayerWithFullMatches(playerWithNewMatches))
            .reduce((arr, pfm) => [...arr, pfm], []);
    }
    getDotaIds(playersMap) {
        const dotaIds = [];
        for (const id of playersMap.keys()) {
            dotaIds.push(id);
        }
        return dotaIds;
    }
}
exports.default = NominationService;
