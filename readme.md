# LeagueBot
LeagueBot is a Discord bot designed to make getting information about League of Legends easier.

## LeagueBot has the following commands
1. `!help` - Lists all of the commands and what they are used for.
2. `!build [champion]` - Lists the most popular build for the input champion.
3. `!setName [summoner]` - Sets your summoner name.
4. `!summoner [SummonerName]` - Provides information about a summoner, such as ranking.
5. `!random [lane]` - Gives you a random champion to play, you can also give the command a specific lane to select for.
6. `!lose` - When you lose, this command will ~~remind you that you're garbage~~ help raise your spirits.
7. `!win` - Fetches a picture of a dog who is proud of your accomplishment.
8. `!free` - Lists the free champions for the week.
9. `!chest [summoner]` - Displays the champions that can earn mastery chests.
10. `!mastery [champion]` - Displays mastery information for a given champion.
11. `!counter [champion]` - Displays five counters to a given champion.

## Misc
Commands that take `[summoner]` as an argument (ex, `!chest`) can be used without an argument if the `!setName` command has been used to give the robot your league summoner name.

The bot is started with the command `node src/bot.js`.

Using pm2, the bot can be started with `pm2 start src/bot.js &` and ended with `pm2 delete 0`.

LeagueBot isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games
or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are
trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.