const common = require('../src/common.js');
const getRequest = require('../src/getRequests');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = {
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
            var output = `The build for ${args[0]} are:\n`;

            var buildData = await this.buildDatabase.getBuild(champion);
            if(buildData != null) {
                let expirationCheck = new Date(buildData.date);
                let timeDifference = Math.abs(today.getTime() - expirationCheck.getTime());
                let differenceDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                if(differenceDays < 14) {
                    let buildList = buildData.items.split(" ");
                    for(let i = 0; i < buildList.length; i++) {
                        let item = buildList[i].replace(/-/g, " ");
                        output += `${i+1}: ${item}\n`;
                    }
                    message.channel.send(output);
                    return;
                }
                else{
                    common.botLog(`Champion ${args[0]} has an expired build. Days since update: ${differenceDays}, Last update date: ${buildData.date}`);
                }
            }

            let url = `https://rankedboost.com/league-of-legends/build/${championForURL}/`;
            let rankedboostData = await getRequest.httpsRequest(url);
            let dom = new JSDOM(rankedboostData);
            let domBuildSection = dom.window.document.querySelectorAll("div.item-build-order-wrap > div > ol > li");
            if(domBuildSection.length != 6) {
                message.channel.send(`rankedboost does not have any build data for ${args[0]}.`);
                return;
            }

            let buildsForDatatable
            for(let i = 0; i < domBuildSection.length; i++) {
                let item = domBuildSection[i].querySelector("li > span").textContent;
                output += `${i+1}: ${item}\n`;
                item = item.replace(/\s/g, "-");
                item = item.replace(/'/g, "");
                if(buildsForDatatable == undefined) {
                    buildsForDatatable = `${item} `
                }
                else{
                    buildsForDatatable += `${item} `;
                }
            }

            buildsForDatatable = buildsForDatatable.substring(0, buildsForDatatable.length - 1);
            let dateForDatatable = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
            await this.buildDatabase.setBuild(champion, buildsForDatatable, dateForDatatable);

            message.channel.send(output);
            return;
        }
        catch(e) {
            message.channel.send(`oWo wats dis, ${userInput} doesn't seem to be anybody I know.\nSee log for details.`);
            common.botLog(e);
        }
    }
}
