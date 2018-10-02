const common = require('../src/common.js')
const getRequest = common.httpsGetAsync
const champion = require('../config/champion.json')

function createMessage(arr) {
    var index = 0
    var msg = ''
    arr.forEach(element => {
        msg += `${index+1}: ${arr[index]}\n`
        index++
    })
    return msg
}

module.exports = {
    name:'chest',
    async execute(message, args) {
        try{
            var summonerName = null
            var DBsummonerName = null
            DBsummonerName = await this.botDatabase.get(message)
            if(args.length) {
                summonerName = args[0]
            }
            else if(!args.length && DBsummonerName != null) {
                summonerName = DBsummonerName
            }
            else{
                message.channel.send(`You need to give me a username to look up, like '!ranking ezreal-is-gay'. You can also set your default summoner name with '!setName'.`)
                return
            }
            //List of champions. Sorted by their id, contains their name
            var championList = champion.data
            //List of info about a summoner. Input is their username, output here is their id
            var summonerInfoList = await getRequest(`https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${this.leagueAPI}`)
            //List of mastery info for each champion for a given summoner. Champions are identified by id, no name
            var masteryList = await getRequest(`https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${summonerInfoList.id}?api_key=${this.leagueAPI}`)
            var chestChampionsID = []
            masteryList.forEach(champMastery => {
                if(champMastery.chestGranted == false){
                    chestChampionsID.push(champMastery.championId)
                }
            })
            var chestChampionsName = []
            for(var i in chestChampionsID){
                for(var j in championList){
                    if(i == championList[j].key){
                        chestChampionsName.push(championList[j].name)
                    }
                }
            }
            if(!chestChampionsName.length){
                message.channel.send(`Either you have every chest, no champions, or something went wrong. See the log for details.`)
            }
            else if(chestChampionsName.length > 7){
                var chestChampionsNameShort = []
                var done = false
                var index = 0
                while(!done){
                    if(index == 7){
                        done = true
                    }
                    var nextChamp = chestChampionsName[Math.floor(Math.random() * chestChampionsName.length)]
                    if(!chestChampionsNameShort.includes(nextChamp)){
                        chestChampionsNameShort.push(nextChamp)
                        index++
                    }
                }
                message.channel.send(`${summonerInfoList.name} still has to earn chests on a lot of champions. I'm selecting 8 of them at random.`)
                message.channel.send(`${createMessage(chestChampionsNameShort)}`)
            }
            else{
                message.channel.send(`${summonerInfoList.name}, still has to earn chests on...`)
                message.channel.send(`${createMessage(chestChampionsName)}`)
            }
        }
        catch(e){
            message.channel.send(`Something wrong seems to have happened, check the log.`)
            common.botLog(`${e}`)
        }
    }
}