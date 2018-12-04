const common = require('../src/common')
const getTime = common.getTime

module.exports = {
    name:'summoner',
    async execute(message, args) {
        try {
            var summonerName
            if(!args.length){
                summonerName = await this.botDatabase.getName(message)
            }
            else{
                summonerName = args[0]
            }
            if(summonerName == undefined){
                message.channel.send(common.noName())
                return
            }
            else{
                //summoner command goes here
            }
        }
        catch(e) {
            common.botLog(e)
            message.channel.send(`Something wrong seems to have happened, check the log.`)
        }
    }
}
