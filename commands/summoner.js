const common = require('../src/common')
const getTime = common.getTime

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
            if(summonerName == undefined){
                message.channel.send(common.noName())
                return
            }
            else{
                var summonerInfo
                if(useDB){
                    summonerInfo = await this.botDatabase.getAccountInfo(message)
                }
                else{
                    const summonerURL = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${this.leagueAPI}`
                    summonerInfo = await common.httpsGetAsync(summonerURL)
                }
                if(summonerInfo == undefined){
                    message.channel.send(`I did not find any information for summoner '${summonerName}'. Please ensure you gave me your summoner name or the provided name is correct.`)
                    return
                }
                else{
                    const rankingsURL = `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerInfo.id}?api_key=${this.leagueAPI}`
                    var leaguePositions = await common.httpsGetAsync(rankingsURL)
                    var flex = {
                        queue: "Unranked",
                        tier: "Unranked",
                        winRate: "Unranked",
                        rank: "Unranked",
                        LP: "Unranked"
                    }
                    var solo = {
                        queue: "Unranked",
                        tier: "Unranked",
                        winRate: "Unranked",
                        rank: "Unranked",
                        LP: "Unranked"
                    }
                    leaguePositions.forEach(position => {
                        if(position.queueType == "RANKED_FLEX_SR"){
                            flex.queue = "Flex"
                            flex.tier = position.tier.charAt(0) + position.tier.substr(1).toLowerCase()
                            flex.winRate = ((position.wins / (position.wins + position.losses)) * 100).toFixed(2)
                            flex.rank = position.rank
                            flex.LP = position.leaguePoints
                        }
                        else if(position.queueType == "RANKED_SOLO_5x5"){
                            solo.queue = "Ranked Solo/Duo"
                            solo.tier = position.tier.charAt(0) + position.tier.substr(1).toLowerCase()
                            solo.winRate = ((position.wins / (position.wins + position.losses)) * 100).toFixed(2)
                            solo.rank = position.rank
                            solo.LP = position.leaguePoints
                        }
                    })
                    message.channel.send({embed: {
                        //color: 3447003,
                        color: Math.floor(Math.random() * 16777214) + 1,
                        title: summonerInfo.summonerName,
                        thumbnail: {
                            "url": `attachment://icon.png`
                        },
                        //description: `Summoner ${summonerInfo.summonerName}`,
                        fields: [
                            {
                                name: "Solo/Duo",
                                value: `Tier: ${solo.tier} ${solo.rank}\nLP: ${solo.LP}\nWinrate: ${solo.winRate}%`,
                                inline: true,
                            },
                            {
                                name: "Flex 5x5",
                                value: `Tier: ${flex.tier} ${flex.rank}\nLP: ${flex.LP}\nWinrate: ${flex.winRate}%`,
                                inline: true
                            }
                        ]
                    },files:[{attachment: `config/profileicon/${summonerInfo.profileIconId}.png`, name: 'icon.png'}]})
                }
            }
        }
        catch(e) {
            common.botLog(e)
            message.channel.send(`Something wrong seems to have happened, check the log.`)
        }
    }
}
