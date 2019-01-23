const https = require('https')
const {leagueKey} = require('../config/auth.json')
const common = require('./common')
module.exports = {
    httpsGetAsync: function(url) {
        return new Promise((resolve, reject) => {
            https.get(url, (response) => {
                let statusCode = response.statusCode
                if(statusCode != 200){
                    common.botLog(`Status code ${statusCode} from API call.`)
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
    //SUMMONER-V4 - /lol/summoner/v4/summoners/by-name/{summonerName}
    getSummonerByName: async function(summonerName) {
        var summonerNameRegex = /^[a-z0-9 _.]+$/i
        var NameIsValid = summonerNameRegex.test(summonerName)
        if(NameIsValid) {
            var summoner = await this.httpsGetAsync(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${leagueKey}`)
            return summoner
        }
        else {
            return null
        }
    },
    //CHAMPION-V3 - /lol/platform/v3/champion-rotations
    getCurrentFreeChampions: async function() {
        var freeChampionList = await this.httpsGetAsync(`https://na1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${leagueKey}`)
        return freeChampionList
    },
    //CHAMPION-MASTERY-V4 - /lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}
    getChampionMasteryBySummonerID: async function(summonerID) {
        if(summonerID == null) {
            return null
        }
        else {
            var mastery = await this.httpsGetAsync(`https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerID}?api_key=${leagueKey}`)
            return mastery 
        }
    },
    //CHAMPION-MASTERY-V4 - /lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}/by-champion/{championId}
    getSpecificChampionMastery: async function(accountID, championID) {
        if(accountID == null || championID == null) {
            return null
        }
        else {
            var mastery = await this.httpsGetAsync(`https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${accountID}/by-champion/${championID}?api_key=${leagueKey}`)
            return mastery
        }
    },
    //LEAGUE-V4 - /lol/league/v4/positions/by-summoner/{encryptedSummonerId}
    getRankingBySummoner: async function(summonerID) {
        if(summonerID == null) {
            return null
        }
        else {
            var ranking = await this.httpsGetAsync(`https://na1.api.riotgames.com/lol/league/v4/positions/by-summoner/${summonerID}?api_key=${leagueKey}`)
            return ranking
        }
    },
    //SPECTATOR-V4 - /lol/spectator/v4/active-games/by-summoner/{encryptedSummonerId}
    getInfoAboutCurrentGame: async function(summonerID) {
        if(summonerID == null) {
            return null
        }
        else {
            var gameInfo = await this.httpsGetAsync(`https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${summonerID}?api_key=${leagueKey}`)
            return gameInfo
        }
    }
}