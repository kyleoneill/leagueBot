const common = require('../src/common.js')
const getRequest = common.httpsGetAsync

module.exports = {
    name:'chest',
    async execute(message, args) {
        if(!args.length) {
            message.channel.send(`You need to specify a summoner to check. See '!help' for details.`)
            return
        }
        //List of champions. Sorted by their id, contains their name
        var championList = await getRequest(`https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&dataById=true&api_key=${this.leagueAPI}`)
        //List of info about a summoner. Input is their username, output here is their id
        var summonerInfo = await getRequest(`https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${args[0]}?api_key=${this.leagueAPI}`)
        //List of mastery info for each champion for a given summoner. Champions are identified by id, no name
        var championMastery = await getRequest(`https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${summonerInfo.id}?api_key=${this.leagueAPI}`)
    }
}