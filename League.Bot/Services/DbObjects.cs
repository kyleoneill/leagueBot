using System;
namespace League.Bot.Services
{
    public class DiscordUser
    {
        public string Username { get; set; }
        public string Guild { get; set; }
        public int ID { get; set; }
        public int ProfileIcon { get; set; }
        public int Puuid { get; set; }
        public int AccountID { get; set; }
        public int RiotID { get; set; }
        public string SummonerName { get; set; }

        //Primary key is ID field
        public DiscordUser(string username, string guild, int id, int profileIcon, int puuid, int accountid, int riotid, string summonerName)
        {
            Username = username;
            Guild = guild;
            ID = id;
            ProfileIcon = profileIcon;
            Puuid = puuid;
            AccountID = accountid;
            RiotID = riotid;
            SummonerName = summonerName;
        }
    }

    public class ChampionCounter
    {
        //TODO: Should counters be in a list<string> instead of a string?
        public string ChampionName { get; set; }
        public string Counters { get; set; }
        public DateTime ScrapeDate { get; set; }

        //Primary key is ChampionName field
        public ChampionCounter(string championName, string counters, DateTime scrapeDate)
        {
            ChampionName = championName;
            Counters = counters;
            ScrapeDate = scrapeDate;
        }
    }

    public class ChampionBuild
    {
        //TODO: Should items and runes be in a list<string> instead of a string?
        public int ID { get; set; }
        public string ChampionName { get; set; }
        public string Lane { get; set; }
        public string Items { get; set; }
        public string RunePrimary { get; set; }
        public string RuneSecondary { get; set; }
        public DateTime ScrapeDate { get; set; }


        //Primary key is ID field
        public ChampionBuild(int id, string championName, string lane, string items, string runePrimary, string runeSecondary, DateTime scrapeDate)
        {
            ID = id;
            ChampionName = championName;
            Lane = lane;
            Items = items;
            RunePrimary = runePrimary;
            RuneSecondary = runeSecondary;
            ScrapeDate = scrapeDate;
        }
    }

    public class Shrine //TODO: REMOVE ME
    {
        public string PerkName { get; set; }
        public DateTime PerkDate { get; set; }
        public Shrine(string perkName, DateTime perkDate)
        {
            PerkName = perkName;
            PerkDate = perkDate;
        }
    }
}
