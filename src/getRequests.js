const https = require('https')
const {leagueKey} = require('../config/auth.json')
module.exports = {
    httpsGetAsync: function(url) {
        return new Promise((resolve, reject) => {
            https.get(url, (response) => {
                let statusCode = response.statusCode
                if(statusCode != 200){
                    module.exports.botLog(`Status code ${statusCode} from API call.`)
                    reject(statusCode)
                    return null
                }
                let data = ''
                response.on('data', (chunk) => {
                    data += chunk
                })
                response.on('end', () => {
                    resolve(JSON.parse(data))
                })
            }).on('error', reject)
        })
    },
    getSummonerByName: async function(summonerName) {
        var summonerNameRegex = /^[a-z0-9 _.]+$/i
        var NameIsValid = summonerNameRegex.test(summonerName)
        if(NameIsValid) {
            var summoner = await this.httpsGetAsync(`https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${leagueKey}`)
            return summoner
        }
        else {
            return null
        }
    },
    getCurrentFreeChampions: async function() {
        var freeChampionList = await this.httpsGetAsync(`https://na1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${leagueKey}`)
        return freeChampionList
    },
    getChampionMasteryBySummonerID: async function(summonerID) {
        var mastery = await this.httpsGetAsync(`https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${summonerID}?api_key=${leagueKey}`)
        return mastery
    },
    getSpecificChampionMastery: async function(accountID, championID) {
        var mastery = await this.httpsGetAsync(`https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${accountID}/by-champion/${championID}?api_key=${leagueKey}`)
        return mastery
    },
    getRankingBySummoner: async function(summonerID) {
        var ranking = await this.httpsGetAsync(`https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerID}?api_key=${leagueKey}`)
        return ranking
    }
}