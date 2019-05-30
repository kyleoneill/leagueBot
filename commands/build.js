const common = require('../src/common.js');
const helper = require('../src/helperFunctions.js');

module.exports = {
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
            var build = new Object;
            var updateDB = true;

            var buildData = await this.buildDatabase.getBuild(champion);
            if(buildData != null) {
                let expirationCheck = new Date(buildData.date);
                let timeDifference = Math.abs(today.getTime() - expirationCheck.getTime());
                let differenceDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                if(differenceDays < 14) {
                    updateDB = false;
                    build.items = getItemList(buildData.items);
                    build.primaryRunes = getRuneList(buildData.runePrimary);
                    build.secondaryRunes = getRuneList(buildData.runeSecondary);
                }
                else{
                    common.botLog(`Champion ${args[0]} has an expired build. Days since update: ${differenceDays}, Last update date: ${buildData.date}`);
                }
            }
            if(updateDB) {
                build = await helper.rankedBoostBuild(championForURL);
                if(build == null) {
                    message.channel.send(`RankedBoost does not have any build data for ${args[0]}.`);
                    return;
                }
                let dateForDatatable = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
                await this.buildDatabase.setBuild(champion, build.itemsDB, build.primaryRunesDB, build.secondaryRunesDB, dateForDatatable);
            }
            message.channel.send(output + build.items + "\n" + build.primaryRunes + "\n" + build.secondaryRunes);
        }
        catch(e) {
            message.channel.send(`There isn't any build data for ${args[0]} on RankedBoost.\nSee log for details.`);
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