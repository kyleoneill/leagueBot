const common = require('../src/common')
const getTime = common.getTime
const buildList = require('../config/buildList.json')

module.exports = {
    name:'random',
    execute(message, args) {
        var champList = Object.keys(buildList)
        var champ = champList[Math.floor(Math.random() * champList.length)]
        message.channel.send(`You're going to be playing ${champ} this game, have fun!`)
    }
}