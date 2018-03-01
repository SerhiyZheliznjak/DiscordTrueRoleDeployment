"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rx_http_request_1 = require("rx-http-request");
const rxjs_1 = require("rxjs");
const util_1 = require("util");
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
        return util_1.format('https://api.opendota.com/api/players/%s/recentMatches', account_id);
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
    getFullMatches(matcheIds) {
        const formatedUrls = matcheIds.map(match_id => DotaApi.getMatchUrl(match_id));
        return rxjs_1.Observable.forkJoin(formatedUrls.map(url => this.queueRequest(url)));
    }
    getMatch(match_id) {
        return this.queueRequest(DotaApi.getMatchUrl(match_id));
    }
    moveQueue() {
        DotaApi.queueSubscription = rxjs_1.Observable.interval(400).subscribe(() => {
            if (DotaApi.queue.length > 0) {
                const nextRequest = DotaApi.queue.shift();
                if (nextRequest.retryCount === 0) {
                    nextRequest.observers.forEach(obs => obs.error('Failed to fetch from ' + nextRequest.url));
                }
                console.log('requesting ', nextRequest.url);
                this.rxHttpRequest.get(nextRequest.url).subscribe((data) => {
                    let obj;
                    try {
                        obj = JSON.parse(data.body);
                    }
                    catch (err) {
                        console.error(err, nextRequest.url, '. response data: ', data.body);
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
            else {
                this.stopQueue();
            }
        }, err => console.error(err));
    }
    stopQueue() {
        if (DotaApi.queueSubscription) {
            DotaApi.queueSubscription.unsubscribe();
            DotaApi.queueSubscription = undefined;
        }
    }
    retry(request) {
        request.retryCount -= 1;
        console.log('retrying ', request.url);
        DotaApi.queue.push(request);
    }
}
DotaApi.queue = [];
exports.default = DotaApi;
