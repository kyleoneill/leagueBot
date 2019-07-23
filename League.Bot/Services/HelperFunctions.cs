using System;
using League.Bot.Services;
using AngleSharp;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace League.Bot.Services
{
    public static class HelperFunctions
    {
        public static async Task<List<Shrine>> GetShrineOnline(WebRequester webRequester)
        {
            List<Shrine> perks = new List<Shrine>();
            string uri = "https://deadbydaylight.gamepedia.com/Dead_by_Daylight_Wiki";
            string responseBody = await webRequester.GetRequest(uri);
            var context = BrowsingContext.New(Configuration.Default);
            var document = await context.OpenAsync(req => req.Content(responseBody));
            var htmlPerks = document.QuerySelectorAll(".wikitable > tbody > tr:nth-child(n+2):nth-child(-n+5) > td:nth-child(2)");
            foreach (var perk in htmlPerks)
            {
                string cleanPerk = perk.TextContent.Replace(Environment.NewLine, "");
                perks.Add(new Shrine(cleanPerk, DateTime.Today));
            }
            return perks;
        }
        public static bool WednesdayInRange(DateTime beginDate, DateTime endDate)
        {
            if ((endDate - beginDate).Days > 6)
            {
                return true;
            }
            int range = (endDate - beginDate).Days;
            for (double i = 0; i < range; i++)
            {
                DateTime newDate = beginDate.AddDays(i);
                if (newDate.DayOfWeek == DayOfWeek.Wednesday)
                {
                    return true;
                }
            }
            return false;
        }
    }
}
