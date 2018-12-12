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
                if(championId != undefined){
                    const url = `https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${accountInfo.id}/by-champion/${championId}?api_key=${this.leagueAPI}`
                    const masteryData = await getRequest(url).catch((error) => null)
                    if (masteryData != null) {
                        message.channel.send({embed: {
                            color: Math.floor(Math.random() * 16777214) + 1,
                            title: printableChampionName,
                            thumbnail: {
                                "url": `attachment://icon.png`
                            },
                            //description: `Summoner ${summonerInfo.summonerName}`,
                            fields: [
                                {
                                    name: "Mastery",
                                    value: `Mastery Level: ${masteryData.championLevel}\nChest Earned: ${masteryData.chestGranted.toString().toProper()}`,
                                    inline: true
                                },
                                {
                                    name: "Mastery Points",
                                    value: `Mastery Points: ${masteryData.championPoints}\nMastery Points Until Next Level: ${masteryData.championPointsUntilNextLevel}`,
                                    inline: true
                                }
                            ]
                        }, files:[{attachment: `config/photos/champion/${championName.toLowerCase()}.png`, name: 'icon.png'}]})
                    } 
                    else {
                        message.channel.send(`You have no mastery data for ${printableChampionName}.`)
                    }
                }
                else{
                    message.channel.send(`I don't know ${championName}, are you sure that this champion exists?`)
                }
            }
        }
        catch(e) {
            common.botLog(e)
            message.channel.send(`Something wrong seems to have happened, check the log.`)
        }
    }
}
