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
            message.channel.send(`oWo wats dis, ${champ} doesn't seem to be anybody I know.\nSee log for details.`)
            console.log(`${getTime()}: ${e}`)
        }
    }
}