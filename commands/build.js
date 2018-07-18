const common = require('../src/common')
const getTime = common.getTime
const buildList = require('../config/champions.json')

module.exports = {
    name:'build',
    async execute(message, args) {
        try {
            if(!args.length) {
                message.channel.send(`You need to tell me which champion to search for, like '!build garen'.`)
            }
            else {
                //https://www.mobafire.com/league-of-legends/champion/singed-18/guides
                var champ = args[0].toLowerCase()
                var build = buildList[champ]
                var itemCounter = 1
                var msg = `Your build is going to be...`
                build.forEach(item => {
                    msg += `\n${itemCounter}. ${item}`
                    itemCounter++
                });
                message.channel.send(msg)
            }
        }
        catch(e) {
            message.channel.send(`oWo wats dis, ${champ} doesn't seem to be anybody I know.\nMake sure you're inputting the champion name as one word. 'Lee Sin' should be input as 'leesin'.\nSee log for details.`)
            console.log(`${getTime()}: ${e}`)
        }
    }
}