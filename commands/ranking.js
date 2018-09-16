const common = require('../src/common.js')

module.exports = {
    name:'ranking',
    async execute(message, args) {
        if(!args.length) {
            message.channel.send(`You need to give me a username to look up, like '!ranking teemo4lyfe'.`)
        }
        else {
            try {
                const summonerURL = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${args[0]}?api_key=${this.leagueAPI}`
                var summonerInfo = await common.httpsGetAsync(summonerURL)

                const rankingsURL = `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerInfo.id}?api_key=${this.leagueAPI}`
                var leaguePositions = await common.httpsGetAsync(rankingsURL)

                message.channel.send(`Ranking for ${summonerInfo.name}:`)
                leaguePositions.forEach(position => {
                    const winRate = ((position.wins / (position.wins + position.losses)) * 100).toFixed(2)
                    message.channel.send(`Queue Type: ${position.queueType}\nRank: ${position.tier}\nLeague Name: ${position.leagueName}\nLP: ${position.leaguePoints}\nRecent Winrate: ${winRate}%`)
                });
            }
            catch(e) {
                message.channel.send(`Something seems to have gone wrong, are you sure the username '${args[0]}' exists?\nCheck the log for details.`)
                common.botLog(`${e}`)
            }
        }
    }
}
