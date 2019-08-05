using System;
using System.Threading.Tasks;
using Discord;
using Discord.Commands;
using League.Bot.Services;

namespace League.Bot.Commands
{
    public partial class BotCommands : ModuleBase<SocketCommandContext>
    {
        [Command("setName")]
        [Summary("Sets your summoner name.")]
        public async Task SetName(string summonerName)
        {
            Summoner summoner = await _webRequester.GetSummonerByNameAsync(summonerName);
            DiscordUser user = new DiscordUser(Context.Message.Author.Username, Context.Guild.Name, summoner.Id);
            _db.SetUser(user);
            _db.SetSummoner(summoner);
            await Context.Channel.SendMessageAsync($"I've set your name to {summoner.Name}.");
        }
    }
}
