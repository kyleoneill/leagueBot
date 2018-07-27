const common = require('../src/common.js')
const https = require('https')

const refreshButtonSel = '#SummonerRefreshButton'

function httpsGetAsync(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = ''
            response.on('data', (chunk) => {
                data += chunk
            })
            response.on('end', () => {
                resolve(JSON.parse(data))
            })
        }).on('error', reject)
    })
}

module.exports = {

    //Selectors here must be fixed

    name:'ranking',
    async execute(message, args) {
        if(!args.length) {
            message.channel.send(`You need to give me a username to look up, like '!ranking teemo4lyfe'.`)
        }
        else {
            try {
                const summonerName = args[0]
                const summonerURL = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${this.leagueAPI}`
                var summonerInfo = await httpsGetAsync(summonerURL)

                const rankingsURL = `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerInfo.id}?api_key=${this.leagueAPI}`
                var leaguePositions = await httpsGetAsync(rankingsURL)

                leaguePositions.forEach(position => {
                    const winRate = ((position.wins / (position.wins + position.losses)) * 100).toFixed(2)
                    message.channel.send(`Ranking for ${summonerInfo.name}:\nQueue Type: ${position.queueType}\nRank: ${position.tier}\nLeague Name: ${position.leagueName}\nLP: ${position.leaguePoints}\nRecent Winrate: ${winRate}%`)
                });
            }
            catch(e) {
                message.channel.send(`Something seems to have gone wrong, are you sure the username '${args[0]}' exists?\nCheck the log for details.`)
                console.log(`${common.getTime()}: ${e}`)
            }
        }
    }
}
