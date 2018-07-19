const common = require('../src/common.js')
module.exports = {
    name:'rating',
    async execute(message, args, leagueBrowser) {
        var link = `http://na.op.gg/summoner/userName=${args[0]}`
        await leagueBrowser.navigate(link)
        await message.channel.send(`Placeholder`)
    }
}
