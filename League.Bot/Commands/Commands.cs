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
    //TOOD: Break this into a partial class so every command can be in its own file?
    public partial class BotCommands : ModuleBase<SocketCommandContext>
    {
        readonly WebRequester _webRequester;
        readonly BotDatabase _db;
        public BotCommands(WebRequester requester, BotDatabase db)
        {
            _webRequester = requester;
            _db = db;
        }

        /*
        [Command("getName")]
        [Summary("Gets your summoner name.")]
        public async getName DbGet()
        {

        }
        */

        /*
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
        */
    }
}
