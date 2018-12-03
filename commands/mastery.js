const common = require('../src/common')
const getTime = common.getTime
const getRequest = common.httpsGetAsync
const champion = require('../config/champion.json')

module.exports = {
    name:'mastery',
    async execute(message, args) {
        try {
            const accountInfo = await this.botDatabase.getAccountInfo(message)
            if(accountInfo == null){
                message.channel.send(common.noName())
                return
            }
            else if(!args.length){
                message.channel.send(`You need to give me a champion to look up for summoner ${accountInfo.summonerName}.`)
                return
            }
            else{
                var championName = common.cleanName(args[0])
                var printableChampionName
                var championId
                for(var i in champion.data){
                    if(i.toLowerCase() == championName){
                        championId = champion.data[i].key
                        printableChampionName = champion.data[i].name
                    }
                }
                const url = `https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${accountInfo.id}/by-champion/${championId}?api_key=${this.leagueAPI}`
                const masteryData = await getRequest(url).catch((error) => null)
                if (masteryData != null) {
                    message.channel.send(`Your mastery information for ${printableChampionName}:\nMastery Level: ${masteryData.championLevel}\nChest Earned: ${masteryData.chestGranted}\nMastery Points: ${masteryData.championPoints}\nMastery Points until Next Level: ${masteryData.championPointsUntilNextLevel}`)
                } 
                else {
                    message.channel.send(`You have no mastery data for ${printableChampionName}.`)
                }
            }
        }
        catch(e) {
            common.botLog(`${e}`)
            message.channel.send(`Something wrong seems to have happened, check the log.`)
        }
    }
}
