const common = require('../src/common')
const getTime = common.getTime

module.exports = {
    name:'favChamp',
    async execute(message, args) {
        try {
            if(!args) {
                await message.channel.send(`You're missing arguments. Use 'set' to set a favorite champion or 'get' to see yours.`)
            }
            if(args[0] == 'set') {
                if(!args[1]) {
                    await message.channel.send(`You haven't told me what to set your champion to be.`)
                    return
                }
                var truncatedInput = await args[1].substring(0, 500)
                await this.botDatabase.set(message, truncatedInput)
                await message.channel.send(`I've set your favorite champion to be ${truncatedInput}, ${message.author.username}.`)
            }
            else if(args[0] == 'get') {
                var info = await this.botDatabase.get(message, function(data){
                    if(!data) {
                        message.channel.send(`You haven't set any data yet.`)
                        return
                    }
                    message.channel.send(`${message.author.username}, your favorite champion is ${unescape(data)}`)
                })
            }
            else {
                await message.channel.send(`That isn't a valid argument. See '!help' for assistance.`)
            }
        }
        catch(e) {
            console.log(`${getTime()}: ${e}`)
            message.channel.send(`Something wrong seems to have happened, check the log.`)
        }
    }
}
