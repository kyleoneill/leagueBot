const common = require('../src/common.js')
const getRequest = common.httpsGetAsync

module.exports = {
    name:'free',
    async execute(message, args) {
        try{
            var championListPost = await getRequest(`https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&dataById=true&api_key=${this.leagueAPI}`)
            var freeListPost = await getRequest(`https://na1.api.riotgames.com/lol/platform/v3/champions?freeToPlay=true&api_key=${this.leagueAPI}`)
            var freeChampions = freeListPost.champions
    
            var championList = championListPost.data
            var output = []
            for(var i in freeChampions) {
                for(var j in championList) {
                    if(freeChampions[i].id == championList[j].id) {
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