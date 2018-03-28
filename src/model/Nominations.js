"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OnePunchMan_1 = require("./nominations/OnePunchMan");
const FirstBloodOwner_1 = require("./nominations/FirstBloodOwner");
const Donor_1 = require("./nominations/Donor");
const JungleOppressor_1 = require("./nominations/JungleOppressor");
const RapunzelSyndrome_1 = require("./nominations/RapunzelSyndrome");
const MotherOfGod_1 = require("./nominations/MotherOfGod");
const OponentOwsMoney_1 = require("./nominations/OponentOwsMoney");
const StackGod_1 = require("./nominations/StackGod");
const Parkinson_1 = require("./nominations/Parkinson");
const BestKDA_1 = require("./nominations/BestKDA");
const WinnerForLife_1 = require("./nominations/WinnerForLife");
const Looser_1 = require("./nominations/Looser");
const PingMaster_1 = require("./nominations/PingMaster");
const ChickenSoupLover_1 = require("./nominations/ChickenSoupLover");
const DenyGod_1 = require("./nominations/DenyGod");
const Nenza_1 = require("./nominations/Nenza");
const StunningMan_1 = require("./nominations/StunningMan");
const TacticalFeeder_1 = require("./nominations/TacticalFeeder");
const ThisTimeItWillWork_1 = require("./nominations/ThisTimeItWillWork");
const RoshanHunter_1 = require("./nominations/RoshanHunter");
const TeamFighter_1 = require("./nominations/TeamFighter");
const Pacifist_1 = require("./nominations/Pacifist");
const Freelancer_1 = require("./nominations/Freelancer");
class Nominations {
    static get all() {
        return [
            new OnePunchMan_1.OnePunchMan(),
            new FirstBloodOwner_1.FirstBloodOwner(),
            new Donor_1.Donor(),
            new JungleOppressor_1.JungleOppressor(),
            new RapunzelSyndrome_1.RapunzelSyndrome(),
            new MotherOfGod_1.MotherOfGod(),
            new OponentOwsMoney_1.OponentOwsMoney(),
            new StackGod_1.StackGod(),
            new Parkinson_1.Parkinson(),
            new BestKDA_1.BestKDA(),
            new WinnerForLife_1.WinnerForLife(),
            new Looser_1.Looser(),
            new PingMaster_1.PingMaster(),
            new ChickenSoupLover_1.ChickeSoupLover(),
            new DenyGod_1.DenyGod(),
            new Nenza_1.Nenza(),
            new StunningMan_1.StunningMan(),
            new TacticalFeeder_1.TacticalFeeder(),
            new ThisTimeItWillWork_1.ThisTimeItWillWork(),
            new RoshanHunter_1.RoshanHunter(),
            new TeamFighter_1.TeamFighter(),
            new Pacifist_1.Pacifist(),
            new Freelancer_1.Freelancer()
        ];
    }
    static getByClassName(className) {
        return Nominations.all.find(nomination => nomination.constructor.name.toLowerCase() === className.toLowerCase());
    }
    static getKeyClassNameMap() {
        return Nominations.all.reduce((map, nomination) => {
            map.set(nomination.getKey(), nomination.constructor.name);
            return map;
        }, new Map());
    }
}
exports.default = Nominations;
