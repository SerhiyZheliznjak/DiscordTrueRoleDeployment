"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../Constants");
const StorageConvertionUtil_1 = require("../utils/StorageConvertionUtil");
const mongodb_1 = require("mongodb");
const rxjs_1 = require("rxjs");
const RegisteredPlayerJson_1 = require("../model/json/RegisteredPlayerJson");
class StorageService {
    constructor(mongoClient = mongodb_1.MongoClient, url = Constants_1.default.MONGODB_URI, dbName = Constants_1.default.MONGODB_DB_NAME) {
        this.mongoClient = mongoClient;
        this.url = url;
        this.dbName = dbName;
    }
    getRecentMatchesForPlayer(account_id) {
        return this.find(Constants_1.default.RECENT_MATCHES_COLLECTION)
            .map(json => StorageConvertionUtil_1.default.convertToPlayersRecentMatches(json[0]), { key: account_id });
    }
    getWinners() {
        return this.find(Constants_1.default.HALL_OF_FAME_COLLECTION)
            .map(json => StorageConvertionUtil_1.default.convertToWonNominations(json));
    }
    getPlayersObserved() {
        return this.find(Constants_1.default.PLAYERS_COLLECTION)
            .map(json => StorageConvertionUtil_1.default.convertToPlayerObserved(json));
    }
    updateRecentMatchesForPlayer(account_id, matchesIds) {
        this.update(Constants_1.default.RECENT_MATCHES_COLLECTION, StorageConvertionUtil_1.default.convertToRecentMatchJson(account_id, matchesIds));
    }
    updateNominationResult(result) {
        this.update(Constants_1.default.HALL_OF_FAME_COLLECTION, StorageConvertionUtil_1.default.convertToNominationResultJson(result));
    }
    registerPlayer(account_id, discordId) {
        this.update(Constants_1.default.PLAYERS_COLLECTION, new RegisteredPlayerJson_1.default(account_id, discordId));
    }
    get client() {
        return rxjs_1.Observable.create(clientObserver => this.connectLoop(clientObserver, 5));
    }
    connectLoop(clientObserver, retryCount) {
        this.mongoClient.connect(this.url, (err, client) => {
            if (err !== null) {
                this.connectLoop(clientObserver, retryCount);
            }
            else {
                clientObserver.next(client);
                clientObserver.complete();
            }
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
    update(collectionName, document) {
        this.client.subscribe(client => {
            const db = client.db(this.dbName);
            db.collection(collectionName).update({ key: document.key }, document, { upsert: true });
        });
    }
}
exports.default = StorageService;
