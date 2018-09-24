"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const rxjs_1 = require("rxjs");
class DiscordUtils {
    static generateMessages(claimedNominations, dataStore) {
        return rxjs_1.Observable.from(claimedNominations)
            .flatMap(cn => DiscordUtils.getNomiPlayerTuple(cn, dataStore))
            .map(tuple => {
            const richEmbed = new discord_js_1.RichEmbed();
            richEmbed.setAuthor(tuple[0].nomination.getName(), tuple[1].avatarmedium);
            richEmbed.setTitle(tuple[1].personaname);
            richEmbed.setDescription(tuple[0].nomination.getMessage());
            richEmbed.setThumbnail(tuple[0].nomination.getThumbURL());
            richEmbed.setFooter(tuple[0].nomination.getScoreText());
            richEmbed.setURL(tuple[1].profileurl);
            return richEmbed;
        });
    }
    static getNomiPlayerTuple(nomiRes, dataStore) {
        return dataStore.getProfile(nomiRes.account_id).map(profile => [nomiRes, profile]);
    }
    static getLongestLength(arr) {
        return Math.max(...arr.map(s => s.length));
    }
    static formatAsBlock(text) {
        return '```bash\n' + text + '\n```';
    }
    static getPercentString(n) {
        let result = '' + n;
        if (n < 10) {
            result = ' ' + n;
        }
        if (result.split('.').length === 1) {
            result += '.';
        }
        return (result + '00').slice(0, 5) + '%';
    }
}
exports.DiscordUtils = DiscordUtils;
