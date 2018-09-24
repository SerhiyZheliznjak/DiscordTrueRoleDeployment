"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rx_http_request_1 = require("rx-http-request");
const rxjs_1 = require("rxjs");
const util_1 = require("util");
const Constants_1 = require("../Constants");
class QueuedRequest {
    constructor(url, observers, retryCount, observable) {
        this.url = url;
        this.observers = observers;
        this.retryCount = retryCount;
        this.observable = observable;
    }
}
class DotaApi {
    constructor(rxHttpRequest = rx_http_request_1.RxHttpRequest) {
        this.rxHttpRequest = rxHttpRequest;
    }
    static getMatchUrl(match_id) {
        return util_1.format('https://api.opendota.com/api/matches/%s', match_id);
    }
    static getRecentMatchesUrl(account_id) {
        return util_1.format('https://api.opendota.com/api/players/%s/matches?limit=40&date=%s&sort=start_time', account_id, Constants_1.default.MATCH_DUE_TIME_DAYS);
    }
    queueRequest(url) {
        let observable;
        const queued = this.isQueued(url);
        if (queued === undefined) {
            observable = rxjs_1.Observable.create((observer) => {
                const isQueued = this.isQueued(url);
                if (!isQueued) {
                    DotaApi.queue.push(new QueuedRequest(url, [observer], 3, observable));
                }
                else {
                    isQueued.observers.push(observer);
                }
                if (!DotaApi.queueSubscription) {
                    this.moveQueue();
                }
            });
        }
        else {
            observable = queued.observable;
        }
        return observable;
    }
    isQueued(url) {
        return DotaApi.queue.find(q => q.url === url);
    }
    getPlayerProfile(account_id) {
        return this.queueRequest(util_1.format('https://api.opendota.com/api/players/%s/', account_id));
    }
    getRecentMatches(account_id) {
        return this.queueRequest(DotaApi.getRecentMatchesUrl(account_id));
    }
    getMatch(match_id) {
        return this.queueRequest(DotaApi.getMatchUrl(match_id));
    }
    getWinLoss(account_id, hero_id, with_ids, without_ids) {
        let query = util_1.format('https://api.opendota.com/api/players/%s/wl', account_id);
        query += this.hasQueryParameters(hero_id, with_ids, without_ids) ? '?' : '';
        if (hero_id) {
            query += "hero_id=" + hero_id + '&';
        }
        if (with_ids) {
            with_ids.forEach(id => query += 'included_account_id=' + id + '&');
        }
        if (without_ids) {
            without_ids.forEach(id => query += 'excluded_account_id=' + id + '&');
        }
        return this.queueRequest(query);
    }
    getHeroes() {
        return this.queueRequest('https://api.opendota.com/api/heroes');
    }
    getTeams() {
        return this.queueRequest('https://api.opendota.com/api/teams');
    }
    hasQueryParameters(...args) {
        if (args.find(arg => !!arg)) {
            return true;
        }
        return false;
    }
    moveQueue() {
        DotaApi.queueSubscription = rxjs_1.Observable.interval(500).subscribe(() => {
            if (DotaApi.queue.length > 0) {
                const nextRequest = DotaApi.queue.shift();
                if (nextRequest.retryCount === 0) {
                    console.error('DotaApi: FAILED get ', nextRequest.url);
                    nextRequest.observers.forEach(obs => {
                        obs.next(null);
                        obs.complete();
                    });
                }
                else {
                    console.log('DotaApi: requesting ', nextRequest.url);
                    this.rxHttpRequest.get(nextRequest.url).subscribe((data) => {
                        let obj;
                        try {
                            obj = JSON.parse(data.body);
                        }
                        catch (err) {
                            console.error('DotaApi: ', err, nextRequest.url, '. response data: ', data.body);
                            this.retry(nextRequest);
                        }
                        if (obj) {
                            nextRequest.observers.forEach(obs => {
                                obs.next(obj);
                                obs.complete();
                            });
                        }
                    }, err => {
                        this.retry(nextRequest);
                    }, () => { });
                }
            }
            else {
                this.stopQueue();
            }
        });
    }
    stopQueue() {
        if (DotaApi.queueSubscription) {
            DotaApi.queueSubscription.unsubscribe();
            DotaApi.queueSubscription = undefined;
        }
    }
    retry(request) {
        request.retryCount -= 1;
        console.log('DotaApi: retrying ', request.url);
        DotaApi.queue.push(request);
    }
}
DotaApi.queue = [];
exports.default = DotaApi;
