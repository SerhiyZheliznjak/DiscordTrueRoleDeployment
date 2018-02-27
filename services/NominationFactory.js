"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Nominations_1 = require("../model/Nominations");
class NominationFactory {
    static createByName(name) {
        return Nominations_1.default.all.find(nomination => nomination.getName() === name);
    }
}
exports.default = NominationFactory;
