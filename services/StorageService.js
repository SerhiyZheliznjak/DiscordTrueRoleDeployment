"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../Constants");
const fs_1 = require("fs");
const StorageConvertionUtil_1 = require("../utils/StorageConvertionUtil");
const mkdirp_1 = require("mkdirp");
class StorageService {
    constructor(exists = fs_1.existsSync, readFile = fs_1.readFileSync, writeFile = fs_1.writeFileSync, mkdir = mkdirp_1.mkdirp) {
        this.exists = exists;
        this.readFile = readFile;
        this.writeFile = writeFile;
        this.mkdir = mkdir;
    }
    getRecentMatches() {
        return this.readFileToObject(Constants_1.Constants.RECENT_MATCHES).table;
    }
    saveRecentMatches(recentPlayerMatches) {
        this.writeArrayToFile(StorageConvertionUtil_1.default.convertToRecentMatchJson(recentPlayerMatches), Constants_1.Constants.RECENT_MATCHES);
    }
    saveWinners(winners) {
        this.writeArrayToFile(StorageConvertionUtil_1.default.convertToNominationWinnersJson(winners), Constants_1.Constants.WINNERS_FILE_PATH);
    }
    getWinners() {
        return this.readFileToObject(Constants_1.Constants.WINNERS_FILE_PATH).table;
    }
    getPlayersObserved() {
        return this.readFileToObject(Constants_1.Constants.PLAYERS_FILE_PATH).table;
    }
    savePlayersObserved(playersObserved) {
        this.writeArrayToFile(StorageConvertionUtil_1.default.convertToPlayersPairs(playersObserved), Constants_1.Constants.PLAYERS_FILE_PATH);
    }
    writeArrayToFile(array, filePath) {
        this.createPathIfNeeded(filePath);
        if (!array || !array.length) {
            console.error(filePath, 'write empty array yourself');
            return;
        }
        this.writeFile(filePath, JSON.stringify({ table: array }), 'utf8');
    }
    createPathIfNeeded(filePath) {
        const doesExist = this.exists(filePath);
        if (!doesExist) {
            const pathToCreate = filePath.split('/');
            pathToCreate.pop();
            this.mkdir(pathToCreate.join('/'));
        }
        return doesExist;
    }
    readFileToObject(filePath) {
        if (!this.createPathIfNeeded(filePath)) {
            return { table: [] };
        }
        return JSON.parse(this.readFile(filePath, 'utf8'));
    }
}
exports.default = StorageService;
