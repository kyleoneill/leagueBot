const common = require('../src/common');
const getRequest = require('../src/getRequests')

module.exports = {
    name:'setName',
    async execute(message, args) {
        try{
            if(!args.length){
                var res = await this.database.User.findOne({where: {username: message.author.username}});
                var name = res.summonerName;
                if(name == null){
                    message.channel.send(`You need to provide me a name.`);
                }
                else{
                    message.channel.send(`Your name is currently set to '${name}'.`);
                }
            }
            else{
                var summonerName = args[0];
                var summonerInfo = await getRequest.getSummonerByName(summonerName);
                if(summonerInfo == null) {
                    message.channel.send(`I could not find a summoner named ${summonerName}, was it mis-spelled?`);
                    return
                }
                await this.database.User.upsert({
                    username: message.author.username,
                    profileIconId: summonerInfo.profileIconId,
                    puuid: summonerInfo.puuid,
                    accountId: summonerInfo.accountId,
                    id: summonerInfo.id,
                    summonerName: summonerName
                });
                message.channel.send(`I've set your summoner name to be '${summonerName}'.`);
            }
        }
        catch(e) {
            common.botLog(e);
            message.channel.send(`Something wrong seems to have happened, check the log.`);
        }
    }
}
