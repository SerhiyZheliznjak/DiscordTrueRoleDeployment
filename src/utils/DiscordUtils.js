"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rxjs_1 = require("rxjs");
const Pair_1 = require("../model/Pair");
class DiscordUtils {
    static getRichEmbed(title, description, avatarUrl, footer, url, fields) {
        const richEmbed = new discord_js_1.RichEmbed();
        richEmbed.setTitle(title);
        richEmbed.setDescription(description);
        if (avatarUrl) {
            richEmbed.setThumbnail(avatarUrl);
        }
        if (footer) {
            richEmbed.setFooter(footer);
        }
        if (url) {
            richEmbed.setURL(url);
        }
        if (fields) {
            fields.forEach(field => richEmbed.addField(field.name, field.value, field.inline));
        }
        return richEmbed;
    }
    static generateMessages(claimedNominations, dataStore) {
        return rxjs_1.Observable.from(claimedNominations)
            .flatMap(cn => DiscordUtils.getNomiPlayerPair(cn, dataStore))
            .map(pair => DiscordUtils.getRichEmbed(pair.p2.personaname + ': ' + pair.p1.nomination.getName(), pair.p1.nomination.getMessage(), pair.p2.avatarmedium, pair.p1.nomination.getScoreText(), pair.p2.profileurl));
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
