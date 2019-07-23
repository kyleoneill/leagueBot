using System;
using System.Threading.Tasks;
using Discord;
using Discord.Commands;
using Discord.WebSocket;
using League.Bot.Services;
using AngleSharp;
using AngleSharp.Html.Parser;
using System.Collections.Generic;

namespace League.Bot.Commands
{
    public class BotCommands : ModuleBase<SocketCommandContext>
    {
        readonly WebRequester _webRequester;
        readonly BotDatabase _db;
        public BotCommands(WebRequester requester, BotDatabase db)
        {
            _webRequester = requester;
            _db = db;
        }

        [Command("whosmad")]
        [Summary("Does some stuff")]
        public async Task Stuff()
        {
            await Context.Channel.SendMessageAsync("HOES MAD");
        }

        [Command("square")]
        [Summary("Squares two numbers")]
        public async Task Square(int num)
        {
            int square = num * num;
            await Context.Channel.SendMessageAsync(string.Format("The square of {0} is {1}", num.ToString(), square.ToString()));
        }

        [Command("info")]
        [Summary("States some info about the user")]
        public async Task Info()
        {
            await Context.Channel.SendMessageAsync(string.Format("You are {0}. This is the {1} channel in guild {2}.", Context.Message.Author.Username, Context.Message.Channel.Name, Context.Guild.Name));
        }

        [Command("dbSet")]
        [Summary("foo")]
        public async Task DbSet()
        {
            _db.CreateUser(Context.Message.Author.Username, Context.Guild.Name);
        }

        [Command("dbGet")]
        [Summary("foo")]
        public async Task DbGet()
        {
            DiscordUser user = _db.SelectUser(Context.Message.Author.Username, Context.Guild.Name);
            await Context.Channel.SendMessageAsync(string.Format("Username: {0}\nGuild: {1}\nDatabase ID: {2}", user.Username, user.Guild, user.ID));
        }

        [Command("shrine")]
        [Summary("Provides the current perks available in the Shrine of Secrets.")]
        public async Task ShrineOfSecrets()
        {
            string output = "The current perks in the Shrine of Secrets are...\n";
            bool resetDates = false;
            List<Shrine> perks = _db.GetShrine();
            if (perks.Count > 0)
            {
                resetDates = HelperFunctions.WednesdayInRange(perks[0].PerkDate, DateTime.Today);
            }
            if (perks.Count != 4 || resetDates)
            {
                perks = await HelperFunctions.GetShrineOnline(_webRequester);
                _db.SetShrine(perks);
            }

            Random rand = new Random();
            var embedBuilder = new EmbedBuilder
            {
                Title = "Shrine of Secrets",
                Color = new Color(rand.Next(256), rand.Next(256), rand.Next(256))
            };

            for (int i = 0; i < perks.Count; i++)
            {
                string perkName = perks[i].PerkName.Replace("\n", "");
                output += string.Format("{0}: {1}\n", (i + 1).ToString(), perkName);
            }

            embedBuilder.AddField("Perks", output);

            Embed embed = embedBuilder.Build();
            await Context.Channel.SendMessageAsync(embed: embed);
        }
    }
}
