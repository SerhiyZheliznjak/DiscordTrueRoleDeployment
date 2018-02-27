"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StorageService_1 = require("./StorageService");
const rxjs_1 = require("rxjs");
const DotaApi_1 = require("../dota-api/DotaApi");
const StorageConvertionUtil_1 = require("../utils/StorageConvertionUtil");
class DataStore {
    constructor(dotaApi = new DotaApi_1.default(), storage = new StorageService_1.default()) {
        this.dotaApi = dotaApi;
        this.storage = storage;
    }
    get playerRecentMatchesCache() {
        if (!DataStore.playerRecentMatchesCacheMap) {
            DataStore.playerRecentMatchesCacheMap = StorageConvertionUtil_1.default.convertToPlayerRecentMatches(this.storage.getRecentMatches());
        }
        return DataStore.playerRecentMatchesCacheMap;
    }
    updatePlayerRecentMatches(account_id, matchesIds) {
        this.playerRecentMatchesCache.set(account_id, matchesIds);
    }
    saveRecentMatches() {
        this.storage.saveRecentMatches(this.playerRecentMatchesCache);
    }
    get wonNominationCache() {
        if (!DataStore.wonNominationsCacheMap) {
            DataStore.wonNominationsCacheMap = StorageConvertionUtil_1.default.convertToWonNominations(this.storage.getWinners());
        }
        return DataStore.wonNominationsCacheMap;
    }
    saveWinnersScore(recentWinners) {
        DataStore.wonNominationsCacheMap = recentWinners;
        this.storage.saveWinners(recentWinners);
    }
    get matchesCache() {
        if (!DataStore.matchesCacheMap) {
            DataStore.matchesCacheMap = new Map();
        }
        return DataStore.matchesCacheMap;
    }
    addMatch(match) {
        if (!this.matchesCache.get(match.match_id)) {
            this.matchesCache.set(match.match_id, match);
            if (DataStore.maxMatches) {
                this.matchesCache.delete(this.matchesCache.keys().next().value);
            }
        }
    }
    getMatch(match_id) {
        return rxjs_1.Observable.create(getMatchObserver => {
            const match = this.matchesCache.get(match_id);
            if (!match) {
                this.dotaApi.getMatch(match_id).subscribe(m => {
                    this.addMatch(m);
                    getMatchObserver.next(m);
                    getMatchObserver.complete();
                });
            }
            else {
                getMatchObserver.next(match);
                getMatchObserver.complete();
            }
        });
    }
    getMatches(matchesIds) {
        return rxjs_1.Observable.forkJoin(matchesIds.map(match_id => this.getMatch(match_id)));
    }
    get profilesCache() {
        if (!DataStore.profilesMap) {
            DataStore.profilesMap = new Map();
        }
        return DataStore.profilesMap;
    }
    getProfile(account_id) {
        return rxjs_1.Observable.create(profileObserver => {
            const profile = this.profilesCache.get(account_id);
            if (!profile) {
                this.dotaApi.getPlayerProfile(account_id)
                    .map(p => p.profile)
                    .subscribe(p => {
                    this.profilesCache.set(account_id, profile);
                    profileObserver.next(p);
                    profileObserver.complete();
                }, err => profileObserver.error(err));
            }
            else {
                profileObserver.next(profile);
                profileObserver.complete();
            }
        });
    }
    getPlayers(accountsIds) {
        return rxjs_1.Observable.forkJoin(accountsIds.map(account_id => this.dotaApi.getPlayerProfile(account_id).map((ppj) => ppj.profile)));
    }
}
exports.default = DataStore;
//# sourceMappingURL=DataStore.js.map