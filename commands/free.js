const common = require('../src/common.js');
const champion = require('../config/champion.json');
const getRequest = require('../src/getRequests');

module.exports = {
    name:'free',
    async execute(message, args) {
        try{
            var championList = champion.data;
            var freeListPost = await getRequest.getCurrentFreeChampions();
            var freeChampions = freeListPost.freeChampionIds;
    
            var output = [];
            for(var i in freeChampions) {
                for(var j in championList) {
                    if(freeChampions[i] == championList[j].key) {
                        output.push(championList[j].name);
                        if(output.length == freeChampions.length){
                            var reply = '';
                            for(var i = 0; i < output.length; i++) {
                                reply += `${i+1}: ${output[i]}\n`;
                            }
                            message.channel.send(`The free champions this week are...\n${reply}`);
                            return;
                        }
                    }
                }
            }
        }
        catch(e){
            message.channel.send(`Something wrong seems to have happened, check the logs.`);
            common.botLog(`${e}`);
        }
    }
}