const common = require('../src/common.js')

module.exports = {
    name:'ranking',
    async execute(message, args) {
        var summonerName = args[0] || await this.botDatabase.getName(message); //sumName = args[0] if it exists, otherwise it's botDatabase.get(message)
        if (!summonerName) {
            message.channel.send(`You need to give me a username to look up, like '!ranking teemo4lyfe'. You can also set a default summoner name to use.`)
            return
        }
        try {
            const summonerURL = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${this.leagueAPI}`
            var summonerInfo = await common.httpsGetAsync(summonerURL)

            const rankingsURL = `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerInfo.id}?api_key=${this.leagueAPI}`
            var leaguePositions = await common.httpsGetAsync(rankingsURL)

            message.channel.send(`Ranking for ${summonerInfo.name}:`)
            var flex = new Object()
            var solo = new Object()
            leaguePositions.forEach(position => {
                if(position.queueType == "RANKED_FLEX_SR"){
                    flex.queue = "Ranked Flex"
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
            });
            if(flex.queue != undefined){
                message.channel.send(`Queue Type: ${flex.queue}\nTier: ${flex.tier}\nRank: ${flex.rank}\nLP: ${flex.LP}\nRecent Winrate: ${flex.winRate}%`)
            }
            else{
                message.channel.send(`Summoner ${summonerName} is not ranked in Ranked Flex.`)
            }
            if(solo.queue != undefined){
                message.channel.send(`Queue Type: ${solo.queue}\nTier: ${solo.tier}\nRank: ${solo.rank}\nLP: ${solo.LP}\nRecent Winrate: ${solo.winRate}%`)
            }
            else{
                message.channel.send(`Summoner ${summonerName} is not ranked in Ranked Solo/Duo.`)
            }
        }
        catch(e) {
            message.channel.send(`Something seems to have gone wrong, are you sure the summoner '${summonerName}' exists?\nCheck the log for details.`)
            common.botLog(`${e}`)
        }
    }
}
