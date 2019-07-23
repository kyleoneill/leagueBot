using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;

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
    }
}
