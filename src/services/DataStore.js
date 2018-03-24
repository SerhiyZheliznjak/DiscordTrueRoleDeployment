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
    getRecentMatchesForPlayer(account_id) {
        return this.storage.getRecentMatchesForPlayer(account_id);
    }
    updatePlayerRecentMatch(account_id, matchesIds) {
        this.storage.updateRecentMatchesForPlayer(account_id, matchesIds);
    }
    get hallOfFame() {
        return this.storage.getWinners();
    }
    updateNominationResult(nominationResult) {
        this.storage.updateNominationResult(nominationResult);
    }
    get matchesCache() {
        if (DataStore.matchesCacheMap.size === 0) {
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
                if (m) {
                    this.addMatch(m);
                }
                return m;
            });
        }
        else {
            return rxjs_1.Observable.of(match);
        }
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
    get registeredPlayers() {
        if (DataStore.registeredPlayersCache.size === 0) {
            return this.storage.getPlayersObserved().map(map => {
                DataStore.registeredPlayersCache = map;
                return map;
            });
        }
        return rxjs_1.Observable.of(DataStore.registeredPlayersCache);
    }
    registerPlayer(account_id, discordId) {
        this.storage.registerPlayer(account_id, discordId);
    }
}
DataStore.matchesCacheMap = new Map();
DataStore.registeredPlayersCache = new Map();
exports.default = DataStore;
