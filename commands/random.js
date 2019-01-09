const common = require('../src/common')
const getTime = common.getTime
const buildList = require('../config/buildList.json')
const lanesList = require('../config/lanes.json')

module.exports = {
    name:'random',
    execute(message, args) {
        if(!args.length){
            var champList = Object.keys(buildList)
            var champ = champList[Math.floor(Math.random() * champList.length)]
            message.channel.send(`You're going to be playing ${champ.toProper()} this game, have fun!`)
        }
        else{
            var messageText = "You're going to be playing "
            var laneExists = true
            switch(args[0]) {
                case "top":
                    var champListTop = lanesList['top']
                    messageText += getRandomChampion(champListTop).toProper()
                    break
                case "mid":
                    var champListMid = lanesList['mid']
                    messageText += getRandomChampion(champListMid).toProper()
                    break
                case "bot":
                    var champListBot = lanesList['bot']
                    messageText += getRandomChampion(champListBot).toProper()
                    break
                case "support":
                    var champListSupport = lanesList['support']
                    messageText += getRandomChampion(champListSupport).toProper()
                    break
                case "jungle":
                    var champListJungle = lanesList['jungle']
                    messageText += getRandomChampion(champListJungle).toProper()
                    break
                case "lane":
                    laneExists = false
                    lanes = ["top", "mid", "bot", "support", "jungle"]
                    randomLane = lanes[Math.floor(Math.random() * lanes.length)]
                    messageText = `You'll be playing ${randomLane.toProper()} this game.`
                    break
                default:
                    laneExists = false
                    messageText = "That lane doesn't exist. Please use 'top', 'mid', 'bot', 'support', and 'jungle'."
            }
            if(laneExists){
                messageText += " this game, have fun!"
            }
            message.channel.send(messageText)
        }
    }
}

function getRandomChampion(champList){
    return champList[Math.floor(Math.random() * champList.length)]
}
