const common = require('../src/common')
const getTime = common.getTime

module.exports = {
    name:'setName',
    async execute(message, args) {
        try {
            if(!args.length) {
                var name = await this.botDatabase.get(message)
                if(name != null) {
                    message.channel.send(`Your current username is set to '${name}'.`)
                    return
                }
                else{
                    message.channel.send(`You have not set a username.`)
                    return
                }
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
