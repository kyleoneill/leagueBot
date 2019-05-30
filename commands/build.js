const common = require('../src/common.js');
const getRequest = require('../src/getRequests');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = {
    //TODO: move most of this into helper functions, none of this is readable - and it looks horrible
    //TODO: Please refactor this
    //TODO: Make the output a card rather than raw text, it doesn't look good
    name:'build',
    async execute(message, args) {
        try {
            if(!args.length) {
                message.channel.send(`You need to tell me which champion to search for, like '!build garen'.`);
                return
            }
            var championForURL = common.cleanNameHyphen(args[0]);
            var champion = common.cleanName(args[0]);
            if(!common.championExists(champion)){
                message.channel.send(`I don't think ${args[0]} is a champion, try again.`);
                return;
            }
            var today = new Date();
            var output = `The build for ${args[0]} is:\n`;
            var itemList = '';
            var primaryRuneList = '';
            var secondaryRuneList = '';

            var buildData = await this.buildDatabase.getBuild(champion);
            if(buildData != null) {
                let expirationCheck = new Date(buildData.date);
                let timeDifference = Math.abs(today.getTime() - expirationCheck.getTime());
                let differenceDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                if(differenceDays < 14) {
                    itemList = getItemList(buildData.items);
                    primaryRuneList = getRuneList(buildData.runePrimary);
                    secondaryRuneList = getRuneList(buildData.runeSecondary);
                }
                else{
                    common.botLog(`Champion ${args[0]} has an expired build. Days since update: ${differenceDays}, Last update date: ${buildData.date}`);
                }
            }
            else {
                let url = `https://rankedboost.com/league-of-legends/build/${championForURL}/`;
                let rankedboostData = await getRequest.httpsRequest(url);
                let dom = new JSDOM(rankedboostData);
                let domItemSection = dom.window.document.querySelectorAll("div.item-build-order-wrap > div > ol > li");
                if(domItemSection.length != 6) {
                    message.channel.send(`rankedboost does not have any build data for ${args[0]}.`);
                    return;
                }
    
                let newItemList
                for(let i = 0; i < domItemSection.length; i++) {
                    let item = domItemSection[i].querySelector("li > span").textContent;
                    itemList += `${i+1}: ${item}\n`;
                    item = item.replace(/\s/g, "-");
                    item = item.replace(/'/g, "");
                    if(newItemList == undefined) {
                        newItemList = `${item} `
                    }
                    else{
                        newItemList += `${item} `;
                    }
                }
                newItemList = newItemList.substring(0, newItemList.length - 1);

                let domRuneSection = dom.window.document.querySelectorAll("#runes > div");

                let newPrimaryRunes = '';
                let primaryRuneDom = domRuneSection[0].children;
                primaryRuneList = primaryRuneDom[0].querySelector('div:nth-child(2) > div').textContent + "\n";
                newPrimaryRunes = (primaryRuneDom[0].querySelector('div:nth-child(2) > div').textContent.replace(/\s/g, "-")) + " ";
                for(let i = 1; i < primaryRuneDom.length; i++) {
                    let rune = primaryRuneDom[i].querySelector('div > div').textContent;
                    primaryRuneList += `${i}: ${rune}\n`;
                    rune = rune.replace(/'/g, "");
                    rune = rune.replace(/\s/g, "-");
                    newPrimaryRunes += `${rune} `;
                }
                newPrimaryRunes = newPrimaryRunes.substring(0, newPrimaryRunes.length - 1);

                let newSecondaryRunes = '';
                let secondaryRuneDom = domRuneSection[1].children;
                secondaryRuneList = secondaryRuneDom[0].querySelector('div:nth-child(2) > div').textContent + "\n";
                newSecondaryRunes = (secondaryRuneDom[0].querySelector('div:nth-child(2) > div').textContent.replace(/\s/g, "-")) + " ";
                for(let i = 1; i < secondaryRuneDom.length; i++) {
                    let rune = secondaryRuneDom[i].querySelector('div > div').textContent;
                    secondaryRuneList += `${i}: ${rune}\n`;
                    rune = rune.replace(/'/g, "");
                    rune = rune.replace(/\s/g, "-");
                    newSecondaryRunes += `${rune} `;
                }
                newSecondaryRunes = newSecondaryRunes.substring(0, newSecondaryRunes.length - 1);
    
                let dateForDatatable = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
                await this.buildDatabase.setBuild(champion, newItemList, newPrimaryRunes, newSecondaryRunes, dateForDatatable);
            }
            message.channel.send(output + itemList + "\n" + primaryRuneList + "\n" + secondaryRuneList);
        }
        catch(e) {
            message.channel.send(`oWo wats dis, ${args[0]} doesn't seem to be anybody I know.\nSee log for details.`);
            common.botLog(e);
        }
    }
}

function getItemList(items) {
    let output = '';
    let buildList = items.split(" ");
    for(let i = 0; i < buildList.length; i++) {
        let item = buildList[i].replace(/-/g, " ");
        item = common.addPossessive(item);
        output += `${i+1}: ${item}\n`;
    }
    return output;
}

function getRuneList(runes) {
    let runeList = runes.split(" ")
    let output = runeList[0] + "\n";
    for(let i = 1; i < runeList.length; i++) {
        let rune = runeList[i].replace(/-/g, " ");
        output += `${i}: ${rune}\n`
    }
    return output;
}