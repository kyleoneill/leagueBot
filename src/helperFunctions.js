const getRequest = require('../src/getRequests');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function Build(items, primaryRunes, secondaryRunes, tertiaryRunes) {
    if(items.length != 6 || primaryRunes.length != 5 || secondaryRunes.length != 3 || tertiaryRunes.length != 4) {
        return new Error("Attempted to create an invalid build in helperFunctions::Build");
    }
    var build = {
        items: items,
        primaryRunes: primaryRunes,
        secondaryRunes: secondaryRunes,
        tertiaryRunes: tertiaryRunes
    };
    return build 
}

function extractItemNameFromLink(link) {
    let decoded = decodeURIComponent(link)
    let splitLink = decoded.split('/');
    let item = splitLink[splitLink.length - 1];
    return item
}

function buildRuneSection(runeDom, runeList, selector) {
    for(let i = 0; i < runeDom.length; i++) {
        let rune = runeDom[i].querySelector(selector).textContent;
        runeList.push(rune)
    }
    return 0
}

module.exports = {
    getBuild: async function(champion) {
        let build = await this.championggBuild(champion);
        return build
    },
    championggBuild: async function(champion) {
        //TODO - This currently gets the highest win % runes, maybe it should use the most frequent runes instead?
        var items = [];
        var primaryRunes = [];
        var secondaryRunes = [];
        var tertiaryRunes = [];

        let url = `https://champion.gg/champion/${champion}`;
        let champggData = await getRequest.makeRequest(url);
        let dom = new JSDOM(champggData);

        let domItemSelection = dom.window.document.querySelector(".build-wrapper");

        domItemSelection = domItemSelection.querySelectorAll("a");
        if(domItemSelection.length != 6) {
            return null;
        }
        for(let i = 0; i < domItemSelection.length; i++) {
            let itemLink = domItemSelection[i].href;
            let item = extractItemNameFromLink(itemLink);
            items.push(item);
        }

        let primaryRuneDom = dom.window.document.querySelector('#primary-path');
        let secondaryRuneDom = dom.window.document.querySelector('#secondary-path');
        let tertiaryRuneDom = dom.window.document.querySelector('#secondary-path > div:nth-child(3)');

        for(let i = 0; i < primaryRuneDom.children.length; i++) {
            let currentRune = primaryRuneDom.children[i].querySelector('div[class*="Title"]').innerHTML;
            primaryRunes.push(currentRune);
        }

        secondaryRunes.push(secondaryRuneDom.children[0].querySelector('div[class*="Title"]').innerHTML);
        for(let i = 0; i < secondaryRuneDom.children[1].children.length; i++) {
            let currentRune = secondaryRuneDom.children[1].children[i].querySelector('div[class*="Title"]').innerHTML;
            secondaryRunes.push(currentRune);
        }

        tertiaryRunes.push("Shards")
        let brokenTertiaryNonsense = tertiaryRuneDom.querySelectorAll('div[class*="Title"]');
        for(let i = 0; i < brokenTertiaryNonsense.length; i++) {
            let currentRune = brokenTertiaryNonsense[i].innerHTML;
            tertiaryRunes.push(currentRune);
        }

        let build = Build(items, primaryRunes, secondaryRunes, tertiaryRunes);
        return build

    },
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

        var build = Build(items, primaryRunes, secondaryRunes, tertiaryRunes);

        return build;
    },
}
