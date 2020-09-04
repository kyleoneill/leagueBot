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

## Setup
1. Get Riot's Data Dragon pack
    * Download the Data Dragon pack located [here](https://riot-api-libraries.readthedocs.io/en/latest/ddragon.html) and unpack it.
2. Get images from the data pack
    * Create a folder in `config` called `photos`. 
    * Open the unpacked data dragon folder and navigate to `{current_patch}/img`. Copy the `champion` and `profileicon` folders into `photos`. Make sure all files in `champion` are lowercase.
    * Navigate back to the top of the data dragon folder and then into `img/champion/spash` and copy all files here into a new folder in `photos` named `champion_tiles`.
3. Get the list of current champions from the data pack
    * Open the unpakced data dragon folder and navigate to `{current_patch}/data/en_US`
    * Copy `champion.json` into the `config` folder.
4. Set up environment variables
    * By default LeagueBot uses a .env file
    * The three variables that must be set are 
        * `TOKEN` - The discord bot token
        * `LEAGUEKEY` - The Riot API key
        * `CATKEY` - An API key from [TheDogAPI](https://thedogapi.com/)

## Misc
Commands that take `[summoner]` as an argument (ex, `!chest`) can be used without an argument if the `!setName` command has been used to give the robot your league summoner name.

The bot is started with the command `node src/bot.js`.

Using pm2, the bot can be started with `pm2 start src/bot.js &` and ended with `pm2 delete 0`.

LeagueBot isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games
or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are
trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.