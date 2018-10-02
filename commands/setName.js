const common = require('../src/common')
const getTime = common.getTime

module.exports = {
    name:'setName',
    async execute(message, args) {
        try {
            if(!args) {
                message.channel.send(`You're missing arguments. You need to give me your summoner name.`)
            }
            var name = args[0]
            //var truncatedInput = args[1].substring(0, 500)
            await this.botDatabase.set(message, name)
            message.channel.send(`I've set your summoner name to be '${name}'.`)
        }
        catch(e) {
            common.botLog(`${e}`)
            message.channel.send(`Something wrong seems to have happened, check the log.`)
        }
    }
}
