"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rxjs_1 = require("rxjs");
const Pair_1 = require("../model/Pair");
class DiscordUtils {
    static generateMessages(claimedNominations, dataStore) {
        return rxjs_1.Observable.from(claimedNominations)
            .flatMap(cn => DiscordUtils.getNomiPlayerPair(cn, dataStore))
            .map(pair => {
            const richEmbed = new discord_js_1.RichEmbed();
            richEmbed.setAuthor(pair.p2.personaname, pair.p2.avatarmedium);
            richEmbed.setTitle(pair.p1.nomination.getName());
            richEmbed.setDescription(pair.p1.nomination.getMessage());
            richEmbed.setThumbnail(pair.p1.nomination.getThumbURL());
            richEmbed.setFooter(pair.p1.nomination.getScoreText());
            richEmbed.setURL(pair.p2.profileurl);
            return richEmbed;
        });
    }
    static getNomiPlayerPair(nomiRes, dataStore) {
        return dataStore.getProfile(nomiRes.account_id).map(profile => new Pair_1.default(nomiRes, profile));
    }
    static fillWithSpaces(text, desiredLength) {
        return desiredLength - text.length > 0 ? text + ' '.repeat(desiredLength - text.length) : text;
    }
    static getLongestLength(arr) {
        return Math.max(...arr.map(s => s.length));
    }
    static formatAsBlock(text) {
        return '```bash\n' + text + '\n```';
    }
}
exports.DiscordUtils = DiscordUtils;
