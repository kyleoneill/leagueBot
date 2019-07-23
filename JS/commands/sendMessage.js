const common = require('../src/common.js');

module.exports = {
    name:'sendMessage',
    execute(message, args) {
        try{
            if(message.author.id != this.discordID || !args.length) {
                return;
            }
            var guildObj;
            var guildList = common.unpackMap(this.guildList);
            guildList.forEach(guild => {
                if(guild.name == args[0]) {
                    guildObj = guild;
                }
            });
            var channelList = common.unpackMap(guildObj.channels);
            channelList[0].send(args[1]);
        }
        catch(e){
            common.botLog(e);
        }
    }
}