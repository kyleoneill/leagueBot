const getRequest = require('../src/getRequests');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
module.exports = {
    rankedBoostBuild: async function(champion) {
        var items = [];
        var primaryRunes = [];
        var secondaryRunes = [];

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
        primaryRunes.push(primaryRuneDom[0].querySelector('div:nth-child(2) > div').textContent);
        buildRuneSection(primaryRuneDom, primaryRunes)

        let secondaryRuneDom = domRuneSection[1].children;
        secondaryRunes.push(secondaryRuneDom[0].querySelector('div:nth-child(2) > div').textContent);
        buildRuneSection(secondaryRuneDom, secondaryRunes)

        var build = {
            items: items,
            primaryRunes: primaryRunes,
            secondaryRunes: secondaryRunes,
        }

        return build;
    },
}

function buildRuneSection(runeDom, runeList) {
    for(let i = 1; i < runeDom.length; i++) {
        let rune = runeDom[i].querySelector('.rb-build-rune-text').textContent;
        runeList.push(rune)
    }
    return 0
}
