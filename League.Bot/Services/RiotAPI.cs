using System;
using System.Collections.Generic;

namespace League.Bot.Services
{
    public class Summoner
    {
        public int ProfileIconId { get; set; }
        public string Name { get; set; }
        public string Puuid { get; set; }
        public int SummonerLevel { get; set; }
        public string AccountId { get; set; }
        public string Id { get; set; }
        public long RevisionDate { get; set; }
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
    }
}
