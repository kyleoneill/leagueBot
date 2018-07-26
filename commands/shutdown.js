const common = require('../src/common')
const getTime = common.getTime

module.exports = {
    name:'shutdown',
    async execute(message, args) {
        //message.channel.send(`The current time is ${getTime()}`)
        if(message.author.username != 'sammie287') {
            message.channel.send(`You do not have the authority for that command.`)
            return
        }
        await this.botBrowser.shutdown()
        await this.userDB.close()
        await console.log(`${getTime()}: Browser and DB have been shut down.`)
    }
}