using System;
using System.IO;
using System.Data.SQLite;
using System.Collections.Generic;

namespace League.Bot.Services
{
    public class BotDatabase : IDisposable
    {
        //TODO: Matt says look into using EFCore (Entity Framework Core) to make the sql stuff better?
        SQLiteConnection dbConnection;
        public BotDatabase()
        {
            if (!File.Exists("db.sqlite"))
            {
                Console.WriteLine("Creating new sqlite db");
                SQLiteConnection.CreateFile("db.sqlite");
                SQLiteConnection dbCreateConnection = new SQLiteConnection("Data Source=db.sqlite;Version=3;");
                dbCreateConnection.Open();

                //string username, string guild, int id, int profileIcon, int puuid, int accountid, int summonerid, string summonerName
                string usersQuery = "CREATE TABLE users(userName TEXT, guildName TEXT, riotId TEXT, PRIMARY KEY(userName, guildName));";
                SQLiteCommand usersCommand = new SQLiteCommand(usersQuery, dbCreateConnection);
                usersCommand.ExecuteNonQuery();

                string summonersQuery = "CREATE TABLE summoners(profileIconId INTEGER, name TEXT, puuId TEXT, summonerLevel INTEGER, accountId TEXT, id TEXT PRIMARY KEY, revisionDate INTEGER);";
                SQLiteCommand summonersCommand = new SQLiteCommand(summonersQuery, dbCreateConnection);
                summonersCommand.ExecuteNonQuery();

                //string championName, string counters, DateTime scrapeDate
                string counterQuery = "CREATE TABLE counters(champion TEXT PRIMARY KEY, counters TEXT, scrapedate TEXT);";
                SQLiteCommand counterCommand = new SQLiteCommand(counterQuery, dbCreateConnection);
                counterCommand.ExecuteNonQuery();

                //int id, string championName, string lane, string items, string runePrimary, string runeSecondary, DateTime scrapeDate
                string buildQuery = "CREATE TABLE builds(id INTEGER PRIMARY KEY AUTOINCREMENT, champion TEXT, lane TEXT, items TEXT, runeprimary TEXT, runesecondary TEXT, scrapedate TEXT);";
                SQLiteCommand buildCommand = new SQLiteCommand(buildQuery, dbCreateConnection);
                buildCommand.ExecuteNonQuery();

                dbCreateConnection.Close();
            }
            dbConnection = new SQLiteConnection("Data Source=db.sqlite;Version=3;");
            dbConnection.Open();
        }

        public void RunVoidQuery(string sql)
        {
            SQLiteCommand command = new SQLiteCommand(sql, dbConnection);
            command.ExecuteNonQuery();
        }
        public SQLiteDataReader GetSingleRow(string sql)
        {
            SQLiteCommand command = new SQLiteCommand(sql, dbConnection);
            SQLiteDataReader output = command.ExecuteReader();
            output.Read();
            return output;
        }

        public void SetUser(DiscordUser user)
        {
            RunVoidQuery(user.GetSetQuery());
        }
        public DiscordUser GetUser(string username, string guildname)
        {
            string sql = $"SELECT * FROM users WHERE username = '{username}' AND guildname = '{guildname}';";
            SQLiteDataReader reader = GetSingleRow(sql);
            if(reader == null)
            {
                throw new Exception($"No data found for discord user {username} of guild {guildname}.");
            }
            DiscordUser user = new DiscordUser(reader);
            return user;
        }

        public void SetSummoner(Summoner summoner)
        {
            RunVoidQuery(summoner.GetSetQuery());
        }
        public Summoner GetSummonerBySummonerName(string summonerName)
        {
            string sql = $"SELECT * FROM summoners WHERE name = {summonerName};";
            SQLiteDataReader reader = GetSingleRow(sql);
            if(reader == null)
            {
                throw new Exception($"Summoner ${summonerName} not found in sqlite db.");
            }
            Summoner summoner = new Summoner(reader);
            return summoner;
        }
        public Summoner GetSummonerByDiscordName(string discordName)
        {
            string sql = $"SELECT profileIconId, name, puuId, summonerLevel, accountId, id, revisionDate FROM summoners INNER JOIN users ON users.riotId = summoners.id WHERE userName = '{discordName}';";
            SQLiteDataReader reader = GetSingleRow(sql);
            if (reader == null)
            {
                throw new Exception($"Summoner ${discordName} not found in sqlite db.");
            }
            Summoner summoner = new Summoner(reader);
            return summoner;
        }

        public void SetCounter(ChampionCounter counter)
        {
            RunVoidQuery(counter.GetSetQuery());
        }
        public ChampionCounter GetCounter(string championName)
        {
            string sql = $"SELECT * FROM counters WHERE champion = '{championName}';";
            SQLiteDataReader reader = GetSingleRow(sql);
            if(reader == null)
            {
                throw new Exception($"Counter for champion {championName} not found in sqlite db.");
            }
            ChampionCounter counter = new ChampionCounter(reader);
            return counter;
        }

        public void SetBuild(ChampionBuild build)
        {
            RunVoidQuery(build.GetSetQuery());
        }
        public ChampionBuild GetBuild(string championName)
        {
            string sql = $"SELECT * FROM builds WHERE champion = '{championName}';";
            SQLiteDataReader reader = GetSingleRow(sql);
            ChampionBuild build = new ChampionBuild(reader);
            return build;
        }
        public ChampionBuild GetBuild(string championName, string lane)
        {
            string sql = $"SELECT * FROM builds WHERE champion = '{championName}' AND lane = '{lane}';";
            SQLiteDataReader reader = GetSingleRow(sql);
            ChampionBuild build = new ChampionBuild(reader);
            return build;
        }

        public void Dispose()
        {
            dbConnection.Close();
        }
    }
}
