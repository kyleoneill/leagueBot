const common = require('../src/common');
const getRequest = require('../src/getRequests');
const champion = require('../config/champion.json');

module.exports = {
    name:'mastery',
    async execute(message, args) {
        try {
            const accountInfo = await this.botDatabase.getAccountInfo(message);
            if(accountInfo == null){
                message.channel.send(common.noName());
                return;
            }
            if(!args.length){
                message.channel.send(`You need to give me a champion to look up for summoner ${accountInfo.summonerName}.`);
                return;
            }
            else{
                var championName = common.cleanName(args[0]);
                var championId = common.getChampionId(championName);
                if(championId != null) {
                    const masteryData = await getRequest.getSpecificChampionMastery(accountInfo.id, championId);
                    if (masteryData != null) {
                        var masteryPointsStr = `Mastery Points: ${masteryData.championPoints}\n`;
                        if(masteryData.championLevel > 4 && masteryData.championLevel < 7) {
                            masteryPointsStr += `Get more S ranks to advance.`;
                        }
                        else if(masteryData.championLevel == 7) {
                            masteryPointsStr += "You've reached the maximum level.";
                        }
                        else {
                            masteryPointsStr += `Mastery Points Until Next Level: ${masteryData.championPointsUntilNextLevel}`;
                        }
                        message.channel.send({embed: {
                            color: Math.floor(Math.random() * 16777214) + 1,
                            title: `${args[0]} - ${message.author.username}`,
                            thumbnail: {
                                "url": `attachment://icon.png`
                            },
                            fields: [
                                {
                                    name: "Mastery",
                                    value: `Mastery Level: ${masteryData.championLevel}\n${masteryData.chestGranted ? 'You\'ve earned a chest.' : 'Can still earn a chest'}`,
                                    inline: true
                                },
                                {
                                    name: "Mastery Points",
                                    value: masteryPointsStr,
                                    inline: true
                                }
                            ]
                        }, files:[{attachment: `config/photos/champion/${championName.toLowerCase()}.png`, name: 'icon.png'}]});
                    } 
                    else {
                        message.channel.send(`You have no mastery data for ${args[0]}.`);
                    }
                }
                else{
                    message.channel.send(`I don't know ${args[0]}, are you sure that this champion exists?`);
                }
            }
        }
        catch(e) {
            common.botLog(e);
            message.channel.send(`Something wrong seems to have happened, check the log.`);
        }
    }
}
