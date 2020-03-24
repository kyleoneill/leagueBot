const getRequest = require('../src/getRequests');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
module.exports = {
    rankedBoostBuild: async function(champion) {
        var items = [];
        var primaryRunes = [];
        var secondaryRunes = [];
        var tertiaryRunes = [];

        let url = `https://rankedboost.com/league-of-legends/build/${champion}/`;
        let rankedboostData = await getRequest.httpsRequest(url);
        let dom = new JSDOM(rankedboostData);
        let domItemSection = dom.window.document.querySelectorAll("div.item-build-order-wrap > div > ol > li");

        if(domItemSection.length != 6) {
            return null;
        }

        for(let i = 0; i < domItemSection.length; i++) {
            let item = domItemSection[i].querySelector("li > span").textContent;
            items.push(item);
        }

        let domRuneSection = dom.window.document.querySelectorAll("#runes > div");

        let primaryRuneDom = domRuneSection[0].children;
        buildRuneSection(primaryRuneDom, primaryRunes, '.rb-build-rune-text');

        let secondaryRuneDom = domRuneSection[1].children;
        buildRuneSection(secondaryRuneDom, secondaryRunes, '.rb-build-rune-text');

        let tertiaryRuneDom = domRuneSection[2].children;
        tertiaryRunes.push("Shards");
        buildRuneSection(tertiaryRuneDom, tertiaryRunes, '.third-runes-txt');

        var build = {
            items: items,
            primaryRunes: primaryRunes,
            secondaryRunes: secondaryRunes,
            tertiaryRunes: tertiaryRunes
        }

        return build;
    },
}

function buildRuneSection(runeDom, runeList, selector) {
    for(let i = 0; i < runeDom.length; i++) {
        let rune = runeDom[i].querySelector(selector).textContent;
        runeList.push(rune)
    }
    return 0
}
