const common = require('../src/common.js')
module.exports = {
    name:'ranking',
    async execute(message, args, leagueBrowser) {
        if(!args.length) {
            await message.channel.send(`You need to give me a username to look up, like '!ranking teemo4lyfe'.`)
        }
        else {
            try {
                var tmp
                var profile = {
                    rankedWinRate: null,
                    winrate: null,
                    rank: null,
                    leaguePoints: null,
                }
                var link = `http://na.op.gg/summoner/userName=${args[0]}`
                await leagueBrowser.navigate(link)
                await leagueBrowser.clickSelector('#SummonerRefreshButton')
                await leagueBrowser.wait(5000)
                await leagueBrowser.waitForSel('#SummonerLayoutContent > div.tabItem.Content.SummonerLayoutContent.summonerLayout-summary > div.SideContent > div.TierBox.Box > div.SummonerRatingMedium > div.TierRankInfo > div > span')
                profile.rank = await leagueBrowser.getInnerHTML('#SummonerLayoutContent > div.tabItem.Content.SummonerLayoutContent.summonerLayout-summary > div.SideContent > div.TierBox.Box > div.SummonerRatingMedium > div.TierRankInfo > div > span')
                if(profile.rank != "Unranked") {
                    profile.rank = await leagueBrowser.getInnerHTML('#SummonerLayoutContent > div.tabItem.Content.SummonerLayoutContent.summonerLayout-summary > div.SideContent > div.TierBox.Box > div.SummonerRatingMedium > div.TierRankInfo > div.TierRank > span')
                    profile.leaguePoints = await leagueBrowser.getInnerHTML('#SummonerLayoutContent > div.tabItem.Content.SummonerLayoutContent.summonerLayout-summary > div.SideContent > div.TierBox.Box > div.SummonerRatingMedium > div.TierRankInfo > div.TierInfo > span.LeaguePoints')
                    tmp = await leagueBrowser.getInnerHTML('#SummonerLayoutContent > div.tabItem.Content.SummonerLayoutContent.summonerLayout-summary > div.SideContent > div.TierBox.Box > div.SummonerRatingMedium > div.TierRankInfo > div.TierInfo > span.WinLose > span.winratio')
                    profile.rankedWinRate = tmp.substr(9)
                }
                else {
                    profile.leaguePoints = "Unranked"
                    profile.rankedWinRate = "Unranked"
                }
                profile.winrate = await leagueBrowser.getInnerHTML('#GameAverageStatsBox-summary > div.Box > table > tbody > tr:nth-child(2) > td.Summary > div > div.Text')

                await message.channel.send(`Ranking for ${args[0]}\nRank: ${profile.rank}\nLP: ${profile.leaguePoints}\nRanked Win Rate: ${profile.rankedWinRate}\nOverall Win Rate: ${profile.winrate}`)
            }
            catch(e) {
                await message.channel.send(`Something seems to have gone wrong, are you sure that your username is '${args[0]}'?\nCheck the log for details.`)
                await console.log(`${common.getTime()}: ${e}`)
            }
        }
    }
}
