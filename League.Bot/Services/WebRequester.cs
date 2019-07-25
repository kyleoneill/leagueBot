using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text.RegularExpressions;
using Newtonsoft.Json;

namespace League.Bot.Services
{
    public class WebRequester
    {
        public IHttpClientFactory clientFactory;
        public WebRequester(IHttpClientFactory httpClientFactory)
        {
            clientFactory = httpClientFactory;
        }
        public async Task<string> GetRequest(string uri)
        {
            try
            {
                HttpClient client = clientFactory.CreateClient();
                string responseBody = await client.GetStringAsync(uri);
                return responseBody;
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");
                Console.WriteLine("Message :{0} ", e.Message);
                //TODO: This should not be returning null, there has to be a better way to deal with an exception here
                return null;
            }
        }

        //SUMMONER-V4 - /lol/summoner/v4/summoners/by-name/{summonerName}
        public async Task<Summoner> GetSummonerByNameAsync(string summonerName)
        {
            Regex summonerNameRegex = new Regex(@"^[a-z0-9 _.]+$", RegexOptions.IgnoreCase);
            if (!summonerNameRegex.IsMatch(summonerName) || summonerName.Length > 16)
            {
                throw new Exception(string.Format("Summoner name '{0}' is not valid.", summonerName));
            }
            string url = string.Format("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{0}?api_key={1}", summonerName, Environment.GetEnvironmentVariable("LeagueToken"));
            string res = await GetRequest(url);
            Summoner summoner = JsonConvert.DeserializeObject<Summoner>(res);
            return summoner;
        }

        //CHAMPION-V3 - /lol/platform/v3/champion-rotations
        public async Task<FreeChampions> GetFreeChampionsAsync()
        {
            string url = string.Format("https://na1.api.riotgames.com//lol/platform/v3/champion-rotations?api_key={0}", Environment.GetEnvironmentVariable("LeagueToken"));
            string res = await GetRequest(url);
            FreeChampions freeChampions = JsonConvert.DeserializeObject<FreeChampions>(res);
            return freeChampions;
        }

        //CHAMPION-MASTERY-V4 - /lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}
        public async Task<List<ChampionMastery>> GetChampionMasteryBySummonerIdAsync(string summonerID)
        {
            string url = string.Format("https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{0}?api_key={1}", summonerID, Environment.GetEnvironmentVariable("LeagueToken"));
            string res = await GetRequest(url);
            List<ChampionMastery> championMasteries = JsonConvert.DeserializeObject<List<ChampionMastery>>(res); //TODO: test this
            return championMasteries;
        }

        //CHAMPION-MASTERY-V4 - /lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}/by-champion/{championId}
        public async Task<ChampionMastery> GetSpecificChampionMastery(string summonerID, string championID)
        {
            string url = string.Format("https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{0}/by-champion/{1}?api_key={2}", summonerID, championID, Environment.GetEnvironmentVariable("LeagueToken"));
            string res = await GetRequest(url);
            ChampionMastery championMastery = JsonConvert.DeserializeObject<ChampionMastery>(res);
            return championMastery;
        }

        //LEAGUE-V4 - /lol/league/v4/entries/by-summoner/{encryptedSummonerId}
        public async Task<SummonerRanking> GetRankingBySummoner(string summonerID)
        {
            string url = string.Format("https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/{0}?api_key={1}", summonerID, Environment.GetEnvironmentVariable("LeagueToken"));
            string res = await GetRequest(url);
            SummonerRanking summonerRanking = JsonConvert.DeserializeObject<SummonerRanking>(res);
            return summonerRanking;
        }
    }
}
