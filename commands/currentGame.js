const common = require('../src/common.js')
const getRequest = require('../src/getRequests')

//TODO - Finish this

module.exports = {
    name: 'currentGame',
    async execute(message, args) {
        try {
            var accountInfo
            if(!args.length) {
                accountInfo = await this.database.User.findOne({where: {username: message.author.username}});
            }
            else {
                accountInfo = await getRequest.getSummonerByName(args[0])
            }
            const gameInfo = await getRequest.getInfoAboutCurrentGame(accountInfo.id)
            message.channel.send(`DEBUG: PLATFORM: ${gameInfo.platformId}`)
        }
        catch(e) {
            message.channel.send(`Something wrong seems to have happened, check the log.`)
            common.botLog(`${e}`)
        }
    }
}