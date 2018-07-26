const common = require('../src/common.js')

const refreshButtonSel = '#SummonerRefreshButton'

module.exports = {

    //Selectors here must be fixed

    name:'ranking',
    async execute(message, args) {
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
                await this.leagueBrowser.navigate(link)
                await this.leagueBrowser.clickSelector(refreshButtonSel)
                await this.leagueBrowser.wait(5000) //Long wait is needed for website to update the page
                await this.leagueBrowser.waitForSel('#SummonerLayoutContent > div.tabItem.Content.SummonerLayoutContent.summonerLayout-summary > div.SideContent > div.TierBox.Box > div.SummonerRatingMedium > div.TierRankInfo > div > span')
                profile.rank = await this.leagueBrowser.getInnerHTML('#SummonerLayoutContent > div.tabItem.Content.SummonerLayoutContent.summonerLayout-summary > div.SideContent > div.TierBox.Box > div.SummonerRatingMedium > div.TierRankInfo > div > span')
                if(profile.rank != "Unranked") {
                    profile.rank = await this.leagueBrowser.getInnerHTML('#SummonerLayoutContent > div.tabItem.Content.SummonerLayoutContent.summonerLayout-summary > div.SideContent > div.TierBox.Box > div.SummonerRatingMedium > div.TierRankInfo > div.TierRank > span')
                    profile.leaguePoints = await this.leagueBrowser.getInnerHTML('#SummonerLayoutContent > div.tabItem.Content.SummonerLayoutContent.summonerLayout-summary > div.SideContent > div.TierBox.Box > div.SummonerRatingMedium > div.TierRankInfo > div.TierInfo > span.LeaguePoints')
                    tmp = await this.leagueBrowser.getInnerHTML('#SummonerLayoutContent > div.tabItem.Content.SummonerLayoutContent.summonerLayout-summary > div.SideContent > div.TierBox.Box > div.SummonerRatingMedium > div.TierRankInfo > div.TierInfo > span.WinLose > span.winratio')
                    profile.rankedWinRate = tmp.substr(9)
                }
                else {
                    profile.leaguePoints = "Unranked"
                    profile.rankedWinRate = "Unranked"
                }
                profile.winrate = await this.leagueBrowser.getInnerHTML('#GameAverageStatsBox-summary > div.Box > table > tbody > tr:nth-child(2) > td.Summary > div > div.Text')

                await message.channel.send(`Ranking for ${args[0]}\nRank: ${profile.rank}\nLP: ${profile.leaguePoints}\nRanked Win Rate: ${profile.rankedWinRate}\nOverall Win Rate: ${profile.winrate}`)
            }
            catch(e) {
                await message.channel.send(`Something seems to have gone wrong, are you sure the username '${args[0]}' exists?\nCheck the log for details.`)
                await console.log(`${common.getTime()}: ${e}`)
            }
        }
    }
}
