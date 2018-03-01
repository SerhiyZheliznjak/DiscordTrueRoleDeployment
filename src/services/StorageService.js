"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../Constants");
const StorageConvertionUtil_1 = require("../utils/StorageConvertionUtil");
const mongodb_1 = require("mongodb");
const rxjs_1 = require("rxjs");
class StorageService {
    constructor(mongoClient = mongodb_1.MongoClient, url = Constants_1.default.MONGODB_URI, dbName = Constants_1.default.MONGODB_DB_NAME) {
        this.mongoClient = mongoClient;
        this.url = url;
        this.dbName = dbName;
    }
    getRecentMatches() {
        return this.find(Constants_1.default.RECENT_MATCHES_COLLECTION)
            .map(json => StorageConvertionUtil_1.default.convertToPlayersRecentMatchesMap(json));
    }
    getWinners() {
        return this.find(Constants_1.default.HALL_OF_FAME_COLLECTION)
            .map(json => StorageConvertionUtil_1.default.convertToWonNominations(json));
    }
    getPlayersObserved() {
        return this.find(Constants_1.default.PLAYERS_COLLECTION)
            .map(json => StorageConvertionUtil_1.default.convertToPlayerObserved(json));
    }
    updatePlayerRecentMatches(account_id, matchesIds) {
        this.update(Constants_1.default.RECENT_MATCHES_COLLECTION, [StorageConvertionUtil_1.default.convertToRecentMatchJson(account_id, matchesIds)], 'account_id');
    }
    saveWinners(winners) {
        this.update(Constants_1.default.HALL_OF_FAME_COLLECTION, StorageConvertionUtil_1.default.convertToNominationWinnersJson(winners), 'nominationName');
    }
    registerPlayer(account_id, discordId) {
        this.update(Constants_1.default.PLAYERS_COLLECTION, [StorageConvertionUtil_1.default.convertToPair(account_id, discordId)], 'key');
    }
    get client() {
        return rxjs_1.Observable.create(clientObserver => {
            this.mongoClient.connect(this.url, (err, client) => {
                clientObserver.next(client);
                clientObserver.complete();
            });
        });
    }
    find(collectionName, query) {
        return rxjs_1.Observable.create((subscriber) => {
            this.client.subscribe(client => {
                const db = client.db(this.dbName);
                rxjs_1.Observable.fromPromise(db.collection(collectionName).find(query).toArray())
                    .subscribe((docs) => {
                    subscriber.next(docs);
                    subscriber.complete();
                    client.close();
                });
            });
        });
    }
    update(collectionName, documents, idName) {
        this.client.subscribe(client => {
            const db = client.db(this.dbName);
            documents.forEach(doc => {
                const filterObj = {};
                filterObj[idName] = doc[idName];
                db.collection(collectionName).update(filterObj, doc, { upsert: true });
            });
        });
    }
}
exports.default = StorageService;
