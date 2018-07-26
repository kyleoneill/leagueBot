const common = require('../src/common')
const getTime = common.getTime

module.exports = {
    name:'favChamp',
    execute(message, args) {
        try {
            if(!args) {
                message.channel.send(`You're missing arguments. Use 'set' to set a favorite champion or 'get' to see yours.`)
            }
            if(args[0] == 'set') {
                if(!args[1]) {
                    message.channel.send(`You haven't told me what to set your champion to be.`)
                    return
                }
                var truncatedInput = args[1].substring(0, 500)
                this.botDatabase.set(message, truncatedInput)
                message.channel.send(`I've set your favorite champion to be ${truncatedInput}, ${message.author.username}.`)
            }
            else if(args[0] == 'get') {
                var info = this.botDatabase.get(message)
                if(!info) {
                    message.channel.send(`You haven't set any data yet.`)
                    return
                }
                var {favChamp} = info
                message.channel.send(`${message.author.username}, your favorite champion is ${unescape(favChamp)}.`)
            }
            else {
                message.channel.send(`That isn't a valid argument. See '!help' for assistance.`)
            }
        }
        catch(e) {
            console.log(`${getTime()}: ${e}`)
            message.channel.send(`Something wrong seems to have happened, check the log.`)
        }
    }
}
