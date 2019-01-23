const common = require('../src/common')
const getRequest = require('../src/getRequests')

module.exports = {
    name:'summoner',
    async execute(message, args) {
        try {
            var summonerName
            var useDB = true
            if(!args.length){
                summonerName = await this.botDatabase.getName(message)
            }
            else{
                summonerName = args[0]
                useDB = false
            }
            if(summonerName == null){
                message.channel.send(common.noName())
                return
            }
            else{
                var summonerInfo
                if(useDB){
                    summonerInfo = await this.botDatabase.getAccountInfo(message)
                }
                else{
                    summonerInfo = await getRequest.getSummonerByName(summonerName)
                }
                if(summonerInfo == null){
                    message.channel.send(`I did not find any information for summoner '${summonerName}'. Please ensure you gave me your summoner name or the provided name is correct.`)
                    return
                }
                else{
                    var leaguePositions = await getRequest.getRankingBySummoner(summonerInfo.id)
                    if(leaguePositions == null) {
                        message.channel.send(`I did not find any ranking information for ${summonerName}.`)
                        return
                    }
                    else {
                        var flex = {
                            queue: "Unranked",
                            tier: "Unranked",
                            winRate: "Unranked",
                            rank: "",
                            LP: "Unranked"
                        }
                        var solo = {
                            queue: "Unranked",
                            tier: "Unranked",
                            winRate: "Unranked",
                            rank: "",
                            LP: "Unranked"
                        }
                        leaguePositions.forEach(position => {
                            if(position.queueType == "RANKED_FLEX_SR"){
                                flex.queue = "Flex"
                                flex.tier = position.tier.charAt(0) + position.tier.substr(1).toLowerCase()
                                flex.winRate = (((position.wins / (position.wins + position.losses)) * 100).toFixed(2)) + "%"
                                flex.rank = position.rank
                                flex.LP = position.leaguePoints
                            }
                            else if(position.queueType == "RANKED_SOLO_5x5"){
                                solo.queue = "Ranked Solo/Duo"
                                solo.tier = position.tier.charAt(0) + position.tier.substr(1).toLowerCase()
                                solo.winRate = (((position.wins / (position.wins + position.losses)) * 100).toFixed(2)) + "%"
                                solo.rank = position.rank
                                solo.LP = position.leaguePoints
                            }
                        })
                        message.channel.send({embed: {
                            color: Math.floor(Math.random() * 16777214) + 1,
                            title: summonerInfo.summonerName,
                            thumbnail: {
                                "url": `attachment://icon.png`
                            },
                            fields: [
                                {
                                    name: "Solo/Duo",
                                    value: `Tier: ${solo.tier} ${solo.rank}\nLP: ${solo.LP}\nWinrate: ${solo.winRate}`,
                                    inline: true,
                                },
                                {
                                    name: "Flex 5x5",
                                    value: `Tier: ${flex.tier} ${flex.rank}\nLP: ${flex.LP}\nWinrate: ${flex.winRate}`,
                                    inline: true
                                }
                            ]
                        },files:[{attachment: `config/photos/profileicon/${summonerInfo.profileIconId}.png`, name: 'icon.png'}]})
                    }
                }
            }
        }
        catch(e) {
            common.botLog(e)
            message.channel.send(`Something wrong seems to have happened, check the log.`)
        }
    }
}
