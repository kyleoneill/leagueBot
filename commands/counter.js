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
            //TODO: make a list of counters. Check that list first to see if the html request is not needed.
            //Store the counter with a note of when the counter was stored, if it's been more than a month ago replace the counters
            let champion = common.cleanName(args[0]);
            if(!common.championExists(champion)){
                message.channel.send(`I don't think ${champion} is a champion, try again.`);
                return;
            }
            //TODO: Check here if the champion actually exists before submitting a request
            let url = `https://lolcounter.com/champions/${champion}`;
            let lolcounterData = await getRequest.httpsRequest(url);
            let dom = new JSDOM(lolcounterData);
            let domCounterSection = dom.window.document.querySelectorAll("div.weak-block > div.champ-block");
            var output = `The five best counters for ${args[0]} are:\n`;
            for(let i = 0; i < 5; i++) {
                let championName = domCounterSection[i].querySelector("div.champ-block > div.theinfo > a > div").textContent;
                output += `${i+1}: ${championName}\n`
            }
            message.channel.send(output);

        }
        catch(e){
            message.channel.send(`Something wrong seems to have happened, check the log.`);
            common.botLog(`${e}`);
        }
    }
}