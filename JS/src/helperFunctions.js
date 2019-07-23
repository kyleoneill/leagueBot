const getRequest = require('../src/getRequests');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
module.exports = {
    rankedBoostBuild: async function(champion) {
        var itemsForOutput = [];
        var primaryRunesForOutput = [];
        var secondaryRunesForOutput = [];

        let url = `https://rankedboost.com/league-of-legends/build/${champion}/`;
        let rankedboostData = await getRequest.httpsRequest(url);
        let dom = new JSDOM(rankedboostData);
        let domItemSection = dom.window.document.querySelectorAll("div.item-build-order-wrap > div > ol > li");

        if(domItemSection.length != 6) {
            return null;
        }

        let itemsForDB
        for(let i = 0; i < domItemSection.length; i++) {
            let item = domItemSection[i].querySelector("li > span").textContent;
            itemsForOutput.push(item);
            item = item.replace(/\s/g, "-");
            item = item.replace(/'/g, "");
            if(itemsForDB == undefined) {
                itemsForDB = `${item} `
            }
            else{
                itemsForDB += `${item} `;
            }
        }
        itemsForDB = itemsForDB.substring(0, itemsForDB.length - 1);

        let domRuneSection = dom.window.document.querySelectorAll("#runes > div");

        let primaryRunesForDB = '';
        let primaryRuneDom = domRuneSection[0].children;
        primaryRunesForOutput.push(primaryRuneDom[0].querySelector('div:nth-child(2) > div').textContent);
        primaryRunesForDB = (primaryRuneDom[0].querySelector('div:nth-child(2) > div').textContent.replace(/\s/g, "-")) + " ";
        for(let i = 1; i < primaryRuneDom.length; i++) {
            let rune = primaryRuneDom[i].querySelector('div > div').textContent;
            if(rune == "") {
                break;
            }
            primaryRunesForOutput.push(rune);
            rune = rune.replace(/'/g, "");
            rune = rune.replace(/\s/g, "-");
            primaryRunesForDB += `${rune} `;
        }
        primaryRunesForDB = primaryRunesForDB.substring(0, primaryRunesForDB.length - 1);

        let secondaryRunesForDB = '';
        let secondaryRuneDom = domRuneSection[1].children;
        secondaryRunesForOutput.push(secondaryRuneDom[0].querySelector('div:nth-child(2) > div').textContent);
        secondaryRunesForDB = (secondaryRuneDom[0].querySelector('div:nth-child(2) > div').textContent.replace(/\s/g, "-")) + " ";
        for(let i = 1; i < secondaryRuneDom.length; i++) {
            let rune = secondaryRuneDom[i].querySelector('div > div').textContent;
            if(rune == "") {
                break;
            }
            secondaryRunesForOutput.push(rune);
            rune = rune.replace(/'/g, "");
            rune = rune.replace(/\s/g, "-");
            secondaryRunesForDB += `${rune} `;
        }
        secondaryRunesForDB = secondaryRunesForDB.substring(0, secondaryRunesForDB.length - 1);

        var build = {
            items: itemsForOutput,
            primaryRunes: primaryRunesForOutput,
            secondaryRunes: secondaryRunesForOutput,
            itemsDB: itemsForDB,
            primaryRunesDB: primaryRunesForDB,
            secondaryRunesDB: secondaryRunesForDB
        }
        return build;
    },
}