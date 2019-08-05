using System;
using System.Collections.Generic;
using System.Data.SQLite;

namespace League.Bot.Services
{
    public class DiscordUser
    {
        public string Username { get; set; }
        public string Guild { get; set; }
        public string RiotId { get; set; }
        public string GetSetQuery()
        {
            return $"INSERT INTO users(userName, guildName, riotId) VALUES ('{Username}', '{Guild}', '{RiotId}');";
        }

        //Primary key is ID field
        public DiscordUser(string username, string guild, string riotId)
        {
            Username = username;
            Guild = guild;
            RiotId = riotId;
        }
        public DiscordUser(SQLiteDataReader reader)
        {
            Username = (string)reader["userName"];
            Guild = (string)reader["guildName"];
            RiotId = (string)reader["riotId"];
            reader.Close();
        }
    }

    public class ChampionCounter
    {
        //TODO: Should counters be in a list<string> instead of a string?
        public string ChampionName { get; set; }
        public string Counters { get; set; }
        public DateTime ScrapeDate { get; set; }
        public string GetSetQuery()
        {
            return $"INSERT INTO counters VALUES('{ChampionName}', '{Counters}', '{ScrapeDate.ToString()}');";
        }

        //Primary key is ChampionName field
        public ChampionCounter(string championName, string counters, DateTime scrapeDate)
        {
            ChampionName = championName;
            Counters = counters;
            ScrapeDate = scrapeDate;
        }
        public ChampionCounter(SQLiteDataReader reader)
        {
            ChampionName = (string)reader["champion"];
            Counters = (string)reader["counters"];
            ScrapeDate = (DateTime)reader["scrapedate"];
            reader.Close();
        }
    }

    public class ChampionBuild
    {
        //TODO: Should items and runes be in a list<string> instead of a string?
        public int Id { get; set; }
        public string ChampionName { get; set; }
        public string Lane { get; set; }
        public string Items { get; set; }
        public string RunePrimary { get; set; }
        public string RuneSecondary { get; set; }
        public DateTime ScrapeDate { get; set; }

        public string GetSetQuery()
        {
            return $"INSERT INTO builds VALUES('{ChampionName}', '{Lane}', '{Items}', '{RunePrimary}', '{RuneSecondary}', '{ScrapeDate.ToString()}');";
        }

        //Primary key is Id field
        public ChampionBuild(int id, string championName, string lane, string items, string runePrimary, string runeSecondary, DateTime scrapeDate)
        {
            Id = id;
            ChampionName = championName;
            Lane = lane;
            Items = items;
            RunePrimary = runePrimary;
            RuneSecondary = runeSecondary;
            ScrapeDate = scrapeDate;
        }
        public ChampionBuild(SQLiteDataReader reader)
        {
            Id = (int)(long)reader["id"];
            ChampionName = (string)reader["champion"];
            Lane = (string)reader["lane"];
            Items = (string)reader["items"];
            RunePrimary = (string)reader["runeprimary"];
            RuneSecondary = (string)reader["runeSecondary"];
            ScrapeDate = (DateTime)reader["scraptedate"];
            reader.Close();
        }
    }

    //Primary key is Id field
    public class Summoner
    {
        public int ProfileIconId { get; set; }
        public string Name { get; set; }
        public string PuuId { get; set; }
        public int SummonerLevel { get; set; }
        public string AccountId { get; set; }
        public string Id { get; set; }
        public long RevisionDate { get; set; }
        public string GetSetQuery()
        {
            return $"INSERT INTO summoners VALUES('{ProfileIconId}', '{Name}', '{PuuId}', '{SummonerLevel}', '{AccountId}', '{Id}', '{RevisionDate}');";
        }
        public Summoner() { }
        public Summoner(int profileIconId, string name, string puuId, int summonerLevel, string accountId, string id, long revisionDate)
        {
            ProfileIconId = profileIconId;
            Name = name;
            PuuId = puuId;
            SummonerLevel = summonerLevel;
            AccountId = accountId;
            Id = id;
            RevisionDate = revisionDate;
        }
        public Summoner(SQLiteDataReader reader)
        {
            ProfileIconId = (int)(long) reader["profileIconId"];
            Name = (string)reader["name"];
            PuuId = (string)reader["puuId"];
            SummonerLevel = (int)(long)reader["summonerLevel"];
            AccountId = (string)reader["accountId"];
            Id = (string)reader["Id"];
            RevisionDate = (long)reader["revisionDate"];
            reader.Close();
        }
    }

    public class FreeChampions
    {
        public List<int> FreeChampionIds { get; set; }
        public List<int> FreeChampionIdsForNewPlayers { get; set; }
        public int MaxNewPlayerLevel { get; set; }
    }

    public class ChampionMastery
    {
        public int ChampionLevel { get; set; }
        public bool ChestGranted { get; set; }
        public int ChampionPoints { get; set; }
        public int ChampionPointsSinceLastLevel { get; set; }
        public int ChampionPointsUntilNextLevel { get; set; }
        public string SummonerId { get; set; }
        public int TokensEarned { get; set; }
        public int ChampionId { get; set; }
        public object LastPlayTime { get; set; }
    }

    public class SummonerRanking
    {
        public string QueueType { get; set; }
        public string SummonerName { get; set; }
        public bool HotStreak { get; set; }
        public int Wins { get; set; }
        public bool Veteran { get; set; }
        public int Losses { get; set; }
        public string Rank { get; set; }
        public string Tier { get; set; }
        public bool Inactive { get; set; }
        public bool FreshBlood { get; set; }
        public string LeagueId { get; set; }
        public string SummonerId { get; set; }
        public int LeaguePoints { get; set; }
        public SummonerRanking() { }
    }
}
