const common = require('../src/common');
const buildList = require('../config/buildList.json');

module.exports = {
    name:'build',
    async execute(message, args) {
        try {
            if(!args.length) {
                message.channel.send(`You need to tell me which champion to search for, like '!build garen'.`);
            }
            else {
                var userInput = args[0].toLowerCase();
                var build = buildList[userInput];
                var itemCounter = 1;
                var msg = `Your build is going to be...`;
                build.forEach(item => {
                    msg += `\n${itemCounter}. ${item}`;
                    itemCounter++;
                });
                message.channel.send(msg);
            }
        }
        catch(e) {
            message.channel.send(`oWo wats dis, ${userInput} doesn't seem to be anybody I know.\nSee log for details.`);
            common.botLog(`${e}`);
        }
    }
}