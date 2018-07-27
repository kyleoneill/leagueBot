const common = require('../src/common.js')
const champion = require('../config/champion.json')
const getRequest = common.httpsGetAsync

module.exports = {
    name:'free',
    async execute(message, args) {
        try{
            var championList = champion.data
            var freeListPost = await getRequest(`https://na1.api.riotgames.com/lol/platform/v3/champions?freeToPlay=true&api_key=${this.leagueAPI}`)
            var freeChampions = freeListPost.champions
    
            var output = []
            for(var i in freeChampions) {
                for(var j in championList) {
                    if(freeChampions[i].id == championList[j].key) {
                        output.push(championList[j].name)
                        if(output.length == freeChampions.length){
                            var reply = ''
                            var index = 1
                            output.forEach(element => {
                                reply += `${index}: ${element}\n`
                                index++
                            });
                            message.channel.send(`The free champions this week are...\n${reply}`)
                        }
                    }
                }
            }
        }
        catch(e){
            message.channel.send(`Something wrong seems to have happened, check the logs.`)
            console.log(`${common.getTime()}: ${e}`)
        }
    }
}