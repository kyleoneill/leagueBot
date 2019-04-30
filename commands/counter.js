const common = require('../src/common.js');
const getRequest = require('../src/getRequests');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = {
    name: 'counter',
    async execute(message, args){
        try{
            if(!args.length){
                message.channel.send('What champion do you want to know the counter of? Ask me like this: !counter caitlyn');
                return;
            }
            var champion = common.cleanName(args[0]);
            if(!common.championExists(champion)){
                message.channel.send(`I don't think ${champion} is a champion, try again.`);
                return;
            }

            var today = new Date();
            var output = `The five best counters for ${args[0]} are:\n`;

            var counterData = await this.counterDatabase.getCounter(champion);
            if(counterData != null) {
                let expirationCheck = new Date(counterData.date);
                let differenceTime = Math.abs(today.getTime() - expirationCheck.getTime());
                let differenceDays = Math.ceil(differenceTime / (1000 * 60 * 60 * 24));
                if(differenceDays < 14) {
                    let counterList = counterData.counters.split(" ");
                    for(let i = 0; i < counterList.length; i++) {
                        output += `${i+1}: ${counterList[i]}\n`
                    }
                    message.channel.send(output);
                    return;
                }
            }

            let url = `https://lolcounter.com/champions/${champion}`;
            let lolcounterData = await getRequest.httpsRequest(url);
            let dom = new JSDOM(lolcounterData);
            let domCounterSection = dom.window.document.querySelectorAll("div.weak-block > div.champ-block");
            if(domCounterSection.length == 0) {
                message.channel.send(`lolcounter does not have any counter data for ${args[0]}.`);
                return;
            }

            let countersForDatatable
            for(let i = 0; i < domCounterSection.length && i < 5; i++) {
                let championName = domCounterSection[i].querySelector("div.champ-block > div.theinfo > a > div").textContent;
                output += `${i+1}: ${championName}\n`;
                if(countersForDatatable == undefined) {
                    countersForDatatable = `${championName} `
                }
                else{
                    countersForDatatable += `${championName} `;
                }
            }

            countersForDatatable = countersForDatatable.substring(0, countersForDatatable.length - 1);
            let dateForDatatable = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
            await this.counterDatabase.setCounter(champion, countersForDatatable, dateForDatatable);

            message.channel.send(output);
            return;

        }
        catch(e){
            message.channel.send(`Something wrong seems to have happened, check the log.`);
            common.botLog(`${e}`);
        }
    }
}