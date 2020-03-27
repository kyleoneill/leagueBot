const common = require('../src/common.js');

module.exports = {
    name:'sendMessage',
    execute(message, args) {
        try{
            if(message.author.id != process.env.DISCORDID || !args.length) {
                return;
            }
            var guildList = common.unpackMap(this.guildList);
            guildList.forEach(guild => {
                if(guild.name == args[0]) {
                    var channelList = common.unpackMap(guild.channels);
                    channelList[0].send(args[1]);
                }
            });
        }
        catch(e){
            common.botLog(e);
        }
    }
}