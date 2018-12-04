const common = require('../src/common')
const getTime = common.getTime

module.exports = {
    name:'setName',
    async execute(message, args) {
        try{
            if(!args.length){
                var name =  await this.botDatabase.getName(message)
                if(name == null){
                    message.channel.send(`You need to provide me a name.`)
                }
                else{
                    message.channel.send(`Your name is currently set to '${name}'.`)
                }
            }
            else{
                var name = args[0]
                await this.botDatabase.setSummoner(message, name, this.leagueAPI)
                message.channel.send(`I've set your summoner name to be '${name}'.`)
            }
        }
        catch(e) {
            common.botLog(`${e}`)
            message.channel.send(`Something wrong seems to have happened, check the log.`)
        }
    }
}
