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
                Console.WriteLine("Creating new user database");
                SQLiteConnection.CreateFile("db.sqlite");
                SQLiteConnection dbCreateConnection = new SQLiteConnection("Data Source=db.sqlite;Version=3;");
                dbCreateConnection.Open();

                string usersQuery = "CREATE TABLE users(id INTEGER PRIMARY KEY, username TEXT, guildname TEXT);";
                SQLiteCommand usersCommand = new SQLiteCommand(usersQuery, dbCreateConnection);
                usersCommand.ExecuteNonQuery();

                string shrineQuery = "CREATE TABLE shrine(perkName TEXT PRIMARY KEY, perkDate TEXT);";
                SQLiteCommand shrineCommand = new SQLiteCommand(shrineQuery, dbCreateConnection);
                shrineCommand.ExecuteNonQuery();

                dbCreateConnection.Close();
            }
            dbConnection = new SQLiteConnection("Data Source=db.sqlite;Version=3;");
        }

        public void CreateUser(string username, string guildname)
        {
            dbConnection.Open();
            string sql = string.Format("INSERT INTO users (username, guildname) VALUES ('{0}', '{1}');", username, guildname);
            SQLiteCommand command = new SQLiteCommand(sql, dbConnection);
            command.ExecuteNonQuery();
            dbConnection.Close();
        }

        public DiscordUser SelectUser(string username, string guildname)
        {
            dbConnection.Open();
            string sql = string.Format("SELECT * FROM users WHERE username = '{0}' AND guildname = '{1}';", username, guildname);
            SQLiteCommand command = new SQLiteCommand(sql, dbConnection);
            SQLiteDataReader output = command.ExecuteReader();
            output.Read();
            DiscordUser user = new DiscordUser((string)output["username"], (string)output["guildname"], (int)(long)output["id"]);
            dbConnection.Close();
            return user;
        }

        public void SetShrine(List<Shrine> perks)
        {
            dbConnection.Open();
            string today = DateTime.Today.ToString();
            SQLiteCommand truncateCommand = new SQLiteCommand("DELETE FROM shrine;", dbConnection);
            truncateCommand.ExecuteNonQuery();
            for (int i = 0; i < perks.Count; i++)
            {
                string sql = string.Format("INSERT INTO shrine(perkName, perkDate) VALUES('{0}', '{1}');", perks[i].PerkName, today);
                SQLiteCommand command = new SQLiteCommand(sql, dbConnection);
                command.ExecuteNonQuery();
            }
            dbConnection.Close();
        }

        public List<Shrine> GetShrine()
        {
            dbConnection.Open();
            SQLiteCommand command = new SQLiteCommand("SELECT perkName, perkDate FROM shrine;", dbConnection);
            var dbPerks = command.ExecuteReader();
            List<Shrine> output = new List<Shrine>();
            while (dbPerks.Read())
            {
                DateTime date = Convert.ToDateTime((string)dbPerks["perkDate"]);
                string name = (string)dbPerks["perkName"];
                Shrine shrine = new Shrine(name, date);
                output.Add(shrine);
            }
            dbConnection.Close();
            return output;
        }
    }
}
