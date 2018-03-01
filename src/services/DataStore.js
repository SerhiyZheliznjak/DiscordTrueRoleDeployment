"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StorageService_1 = require("./StorageService");
const rxjs_1 = require("rxjs");
const DotaApi_1 = require("../dota-api/DotaApi");
class DataStore {
    constructor(dotaApi = new DotaApi_1.default(), storage = new StorageService_1.default()) {
        this.dotaApi = dotaApi;
        this.storage = storage;
    }
    get playersRecentMatches() {
        if (!DataStore.playersRecentMatchesCacheMap) {
            return this.storage.getRecentMatches().map(map => {
                DataStore.playersRecentMatchesCacheMap = map;
                return map;
            });
        }
        return rxjs_1.Observable.of(DataStore.playersRecentMatchesCacheMap);
    }
    updatePlayerRecentMatches(account_id, matchesIds) {
        this.playersRecentMatches.subscribe(map => map.set(account_id, matchesIds));
        this.storage.updatePlayerRecentMatches(account_id, matchesIds);
    }
    get wonNominations() {
        if (!DataStore.wonNominationsCacheMap) {
            return this.storage.getWinners().map(map => {
                DataStore.wonNominationsCacheMap = map;
                return map;
            });
        }
        return rxjs_1.Observable.of(DataStore.wonNominationsCacheMap);
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
        const match = this.matchesCache.get(match_id);
        if (!match) {
            return this.dotaApi.getMatch(match_id).map(m => {
                this.addMatch(m);
                return m;
            });
        }
        else {
            return rxjs_1.Observable.of(match);
        }
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
        const profile = this.profilesCache.get(account_id);
        if (profile) {
            return rxjs_1.Observable.of(profile);
        }
        else {
            return this.dotaApi.getPlayerProfile(account_id)
                .map(p => {
                this.profilesCache.set(account_id, profile);
                return p.profile;
            });
        }
    }
    getPlayers(accountsIds) {
        return rxjs_1.Observable.forkJoin(accountsIds.map(account_id => this.dotaApi.getPlayerProfile(account_id).map((ppj) => ppj.profile)));
    }
    get registeredPlayers() {
        if (!DataStore.registeredPlayersMap) {
            return this.storage.getPlayersObserved().map(map => {
                DataStore.registeredPlayersMap = map;
                return map;
            });
        }
        return rxjs_1.Observable.of(DataStore.registeredPlayersMap);
    }
    registerPlayer(account_id, discordId) {
        this.storage.registerPlayer(account_id, discordId);
    }
}
exports.default = DataStore;
