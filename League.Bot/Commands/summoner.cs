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
            string filename = $"https://ddragon.leagueoflegends.com/cdn/{Globals.currentLeaguePatch}/img/profileicon/{summonerObj.ProfileIconId}.png";
            var embedBuilder = new EmbedBuilder
            {
                Title = $"Summoner Info - {summonerObj.Name}",
                Color = new Color(rand.Next(256), rand.Next(256), rand.Next(256)),
                ThumbnailUrl = filename
            };
            for(int i = 0; i < ranking.Count; i++)
            {
                if (ranking[i].QueueType == "RANKED_SOLO_5x5")
                    ranking[i].QueueType = "Solo/Duo";
                else if (ranking[i].QueueType == "RANKED_TEAM_5x5")
                    ranking[i].QueueType = "Team 5x5";
                int winrate = (int)(((float)ranking[i].Wins / (float)(ranking[i].Losses + ranking[i].Wins)) * 100);
                embedBuilder.AddField(ranking[i].QueueType, $"Rank: {ranking[i].Tier.ToTitleCase()} {ranking[i].Rank}\n LP: {ranking[i].LeaguePoints.ToString()}\nWinrate: {winrate}%", true);//i % 2 == 0);
            }
            Embed embed = embedBuilder.Build();
            await Context.Channel.SendMessageAsync(embed: embed);
        }
    }
}
