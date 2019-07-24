using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text.RegularExpressions;

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

        public async Task<string> GetSummonerByNameAsync(string summonerName)
        {
            Regex summonerNameRegex = new Regex(@"^[a-z0-9 _.]+$", RegexOptions.IgnoreCase);
            if (!summonerNameRegex.IsMatch(summonerName) || summonerName.Length > 16)
            {
                throw new Exception(string.Format("Summoner name '{0}' is not valid.", summonerName));
            }
            using(var tempClient = new HttpClient())
            {
                string res = await tempClient.GetStringAsync(string.Format("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{0}?api_key={1}", summonerName, Environment.GetEnvironmentVariable("LeagueToken")));
                return res;
            }
        }
    }
}
