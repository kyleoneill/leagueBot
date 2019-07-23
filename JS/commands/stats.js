const common = require('../src/common');
const getRequest = require('../src/getRequests');

module.exports = {
    name:'stats',
    async execute(message, args) {
        //TODO - finish this - is not present on help or markdown file
        //can go back 100 matches
        //TODO - allow the use of filter parameters like "lane" and "champion"
        var accountInfo = await this.botDatabase.getAccountInfo(message);
        if(accountInfo == null || accountInfo.accountId == null) {
            message.channel.send(common.noName());
            return;
        }
        var matchInfo = await getRequest.getHistoricalMatchInfo(accountInfo.accountId);
        if(matchInfo.matches.length == 0) {
            message.channel.send(`No games found for summoner ${accountInfo.summonerName}`);
            return;
        }
        var gameStats = {
            gamesTop: 0,
            winsTop: 0,
            gamesMid : 0,
            winsMid: 0,
            gamesJungle: 0,
            winsJungle: 0,
            gamesMarksman: 0,
            winsMarksman: 0,
            gamesSupport: 0,
            winsSupport: 0
        }
        for(var i = 0; i < matchInfo.matches.length; i++) {
            if(matchInfo.matches[i].lane == "MID") {
                gameStats.gamesMid++;
            }
            else if(matchInfo.matches[i].lane == "TOP") {
                gameStats.gamesTop++;
            }
            else if(matchInfo.matches[i].lane == "BOTTOM") {
                gameStats.gamesMarksman++;
            }
            else if(matchInfo.matches[i].lane == "JUNGLE") {
                gameStats.gamesJungle++;
            }
            else if(matchInfo.matches[i].lane == "SUPPORT") {
                gameStats.gamesSupport++;
            }
            else if(matchInfo.matches[i].lane == "NONE") {
                continue;
            }
        }
        var foo = ((gameStats.gamesMarksman / matchInfo.matches.length)*100).toFixed(2);
        message.channel.send(`Bot games: ${gameStats.gamesMarksman}\nTotal Games: ${matchInfo.matches.length}\nGames Bot: ${foo}%`);
    }
}
