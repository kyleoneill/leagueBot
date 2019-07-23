using System;
namespace League.Bot.Services
{
    public class DiscordUser
    {
        public string Username { get; set; }
        public string Guild { get; set; }
        public int ID { get; set; }
        public DiscordUser(string username, string guild, int id)
        {
            Username = username;
            Guild = guild;
            ID = id;
        }
    }
    public class Shrine
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
