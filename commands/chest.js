const common = require('../src/common.js')
const champion = require('../config/champion.json')
const getRequest = require('../src/getRequests')

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
            DBsummonerName = await this.botDatabase.getName(message)
            if(args.length) {
                summonerName = args[0]
            }
            else if(!args.length && DBsummonerName != null) {
                summonerName = DBsummonerName
            }
            else{
                message.channel.send(common.noName())
                return
            }
            //List of champions. Sorted by their id, contains their name
            var championList = champion.data
            var summonerInfoList = await getRequest.getSummonerByName(summonerName)
            var masteryList = null
            if(summonerInfoList != null) {
                masteryList = await getRequest.getChampionMasteryBySummonerID(summonerInfoList.id)
            }
            if(summonerInfoList == null || masteryList == null) {
                message.channel.send(`I didn't receieve any data. Are you sure that summoner ${summonerName} exists and has champion masteries?`)
            }
            else {
                var chestChampionsID = []
                masteryList.forEach(champMastery => {
                    if(champMastery.chestGranted == false){
                        chestChampionsID.push(champMastery.championId)
                    }
                })
                var chestChampionsName = []
                for(var i in chestChampionsID){
                    for(var j in championList){
                        if(chestChampionsID[i] == championList[j].key){
                            chestChampionsName.push(championList[j].name)
                        }
                    }
                }
                if(!chestChampionsName.length){
                    message.channel.send(`Either you have every chest, no champions, or something went wrong. See the log for details.`)
                }
                else if(chestChampionsName.length > 8){
                    var chestChampionsNameShort = []
                    var done = false
                    var index = 0
                    while(!done && chestChampionsName.length){
                        if(index == 7){
                            done = true
                        }
                        var rand = Math.floor(Math.random() * chestChampionsName.length)
                        var nextChamp = chestChampionsName[rand]
                        chestChampionsName.splice(rand, 1)
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
        }
        catch(e){
            message.channel.send(`Something wrong seems to have happened, check the log.`)
            common.botLog(`${e}`)
        }
    }
}