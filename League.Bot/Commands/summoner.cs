using System;
using System.Threading.Tasks;
using Discord;
using Discord.Commands;
using Discord.WebSocket;
using League.Bot.Services;
using AngleSharp;
using AngleSharp.Html.Parser;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace League.Bot.Commands
{
    public partial class BotCommands : ModuleBase<SocketCommandContext>
    {
        [Command("summoner")]
        [Summary("Provides information about a summoner.")]
        public async Task Summoner(string summonerName = "")
        {
            Summoner summonerObj;
            if(summonerName == "")
            {
                summonerObj = _db.GetSummonerByDiscordName(Context.Message.Author.Username);
            }
            else
            {
                summonerObj = await _webRequester.GetSummonerByNameAsync(summonerName);
            }
            List<SummonerRanking> ranking = await _webRequester.GetRankingBySummoner(summonerObj.Id);

            Random rand = new Random();
            var embedBuilder = new EmbedBuilder
            {
                Title = $"Summoner Info - {summonerObj.Name}",
                Color = new Color(rand.Next(256), rand.Next(256), rand.Next(256))
            };
            embedBuilder.AddField("Solo/Duo", $"Rank: {ranking[0].Tier.ToTitleCase()} {ranking[0].Rank}\n LP: {ranking[0].LeaguePoints}\n Winrate: {(ranking[0].Wins / ranking[0].Losses) * 100}");

            Embed embed = embedBuilder.Build();
            await Context.Channel.SendMessageAsync(embed: embed);
        }
    }
}
