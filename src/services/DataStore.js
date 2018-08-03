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
    getProfile(account_id) {
        const profile = DataStore.profilesMap.get(account_id);
        if (profile) {
            return rxjs_1.Observable.of(profile);
        }
        else {
            return this.dotaApi.getPlayerProfile(account_id)
                .map(p => {
                DataStore.profilesMap.set(account_id, p.profile);
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
    getWinLoss(account_id, hero_id, with_ids, without_ids) {
        return this.dotaApi.getWinLoss(account_id, hero_id, with_ids, without_ids);
    }
    getHeroId(name) {
        if (DataStore.heroes.size === 0) {
            return this.getHeroes().map(map => map.get(name));
        }
        else {
            return rxjs_1.Observable.of(DataStore.heroes.get(name));
        }
    }
    getHeroes() {
        if (DataStore.heroes.size === 0) {
            return this.dotaApi.getHeroes().map(heroes => heroes.reduce((map, h) => map.set(h.localized_name.split(/['-\s]/).join(''), h.id), DataStore.heroes));
        }
        else {
            return rxjs_1.Observable.of(DataStore.heroes);
        }
    }
    getTeams() {
        const lastYear = new Date().getMilliseconds() - 1000 * 60 * 60 * 24 * 600;
        return this.dotaApi.getTeams().map(teams => teams.filter(team => team.last_match_time > lastYear));
    }
}
DataStore.matchesCacheMap = new Map();
DataStore.profilesMap = new Map();
DataStore.registeredPlayersCache = new Map();
DataStore.heroes = new Map();
exports.default = DataStore;
