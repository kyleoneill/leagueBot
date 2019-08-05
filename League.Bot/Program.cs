using System;
using System.IO;
using System.Threading.Tasks;
using Discord;
using Discord.Commands;
using Discord.WebSocket;
using Microsoft.Extensions.DependencyInjection;
using League.Bot.Commands;
using League.Bot.Services;

namespace League.Bot
{
    class Program
    {
        public static DiscordSocketClient client;
        private IServiceProvider _provider;

        public static async Task Main(string[] args)
        {
            var tcs = new TaskCompletionSource<bool>();
            var mainTask = new Program().MainAsync(tcs);
            Console.CancelKeyPress += (s, e) => {
                e.Cancel = true;
                tcs.SetResult(true);
            };
            await mainTask;
        }

        private Task Log(LogMessage msg)
        {
            Console.WriteLine(msg.ToString());
            return Task.CompletedTask;
        }

        private IServiceProvider ConfigureServices()
        {
            return new ServiceCollection()
                .AddSingleton<DiscordSocketClient>()
                .AddSingleton<CommandService>()
                .AddSingleton<CommandHandlingService>()
                .AddHttpClient()
                .AddSingleton<WebRequester>()
                .AddSingleton<BotCommands>()
                .AddSingleton<BotDatabase>()
                .BuildServiceProvider();
        }

        public async Task MainAsync(TaskCompletionSource<bool> tcs)
        {
            _provider = ConfigureServices();
            
                client = _provider.GetRequiredService<DiscordSocketClient>();

                client.Log += Log;
            _provider.GetRequiredService<CommandService>().Log += Log;

                var token = Environment.GetEnvironmentVariable("DiscordToken");

                await client.LoginAsync(TokenType.Bot, token);
                await client.StartAsync();

                await _provider.GetRequiredService<CommandHandlingService>().InitializeAsync();
                await tcs.Task;

                // Block this task until the program is closed.
        }
    }
}
