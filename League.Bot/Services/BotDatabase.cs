using System;
using System.IO;
using System.Data.SQLite;
using System.Collections.Generic;

namespace League.Bot.Services
{
    public class BotDatabase
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

                //string username, string guild, int id, int profileIcon, int puuid, int accountid, int riotid, string summonerName
                string usersQuery = "CREATE TABLE users(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, guildname TEXT, profileIcon INTEGER, puuid INTEGER, accountid INTEGER, riotid INTEGER, summonername TEXT);";
                SQLiteCommand usersCommand = new SQLiteCommand(usersQuery, dbCreateConnection);
                usersCommand.ExecuteNonQuery();

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
        }

        public void RunVoidQuery(string sql)
        {
            dbConnection.Open();
            SQLiteCommand command = new SQLiteCommand(sql, dbConnection);
            command.ExecuteNonQuery();
            dbConnection.Close();
        }

        public SQLiteDataReader GetSingleRow(string sql)
        {
            dbConnection.Open();
            SQLiteCommand command = new SQLiteCommand(sql, dbConnection);
            SQLiteDataReader output = command.ExecuteReader();
            output.Read();
            dbConnection.Close();
            return output;
        }

        public void SetUser(string username, string guild, int profileIcon, int puuid, int accountid, int riotid, string summonerName)
        {
            string sql = string.Format("INSERT INTO users(username, guildname, profileIcon, puuid, accountid, riotid, summonername) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}');", username, guild, profileIcon, puuid, accountid, riotid, summonerName);
            RunVoidQuery(sql);
        }
        public DiscordUser GetUser(string username, string guildname)
        {
            string sql = string.Format("SELECT * FROM users WHERE username = '{0}' AND guildname = '{1}';", username, guildname);
            SQLiteDataReader reader = GetSingleRow(sql);
            DiscordUser user = new DiscordUser((string)reader["username"], (string)reader["guildname"], (int)(long)reader["id"], (int)reader["profileicon"], (int)reader["puuid"], (int)reader["accountid"], (int)reader["riotid"], (string)reader["summonername"]);
            return user;
        }

        public void SetCounter(string championName, string counters, DateTime scrapeDate)
        {
            string sql = string.Format("INSERT INTO counters(champion, counters, scrapedate) VALUES('{0}', '{1}', '{2}');", championName, counters, scrapeDate.ToString());
            RunVoidQuery(sql);
        }
        public ChampionCounter GetCounter(string championName)
        {
            string sql = string.Format("SELECT * FROM counters WHERE champion = '{0}';", championName);
            SQLiteDataReader reader = GetSingleRow(sql);
            ChampionCounter counter = new ChampionCounter((string)reader["champion"], (string)reader["counters"], (DateTime)reader["scrapedate"]);
            return counter;
        }

        public void SetBuild(string championName, string lane, string items, string runePrimary, string runeSecondary, DateTime scrapeDate)
        {
            string sql = string.Format("INSERT INTO builds(champion, lane, items, runeprimary, runesecondary, scrapedate) VALUES('{0}', '{1}', '{2}', '{3}', '{4}', '{5}');", championName, lane, items, runePrimary, runeSecondary, scrapeDate.ToString());
            RunVoidQuery(sql);
        }
        public ChampionBuild GetBuild(string championName)
        {
            string sql = string.Format("SELECT * FROM builds WHERE champion = '{0}';", championName);
            SQLiteDataReader reader = GetSingleRow(sql);
            ChampionBuild build = new ChampionBuild((int)reader["id"], (string)reader["champion"], (string)reader["lane"], (string)reader["items"], (string)reader["runeprimary"], (string)reader["runesecondary"], (DateTime)reader["scraptedate"]);
            return build;
        }
        public ChampionBuild GetBuild(string championName, string lane)
        {
            string sql = string.Format("SELECT * FROM builds WHERE champion = '{0}' AND lane = '{1}';", championName, lane);
            SQLiteDataReader reader = GetSingleRow(sql);
            ChampionBuild build = new ChampionBuild((int)reader["id"], (string)reader["champion"], (string)reader["lane"], (string)reader["items"], (string)reader["runeprimary"], (string)reader["runesecondary"], (DateTime)reader["scraptedate"]);
            return build;
        }
    }
}
