const common = require('../src/common.js');
const helper = require('../src/helperFunctions.js');
const fs = require('fs');

module.exports = {
    name:'build',
    async execute(message, args) {
        try {
            if(!args.length) {
                message.channel.send(`You need to tell me which champion to search for, like '!build garen'.`);
                return
            }
            var champion = common.cleanName(args[0]);
            if(!common.championExists(champion)){
                message.channel.send(`I don't think ${args[0]} is a champion, try again.`);
                return;
            }
            var today = new Date();
            var build = new Object;
            var updateDB = true;

            var buildData = await this.database.Build.findOne({where: {champion: champion}});
            if(buildData != null) {
                let expirationCheck = new Date(buildData.date);
                let timeDifference = Math.abs(today.getTime() - expirationCheck.getTime());
                let differenceDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                if(differenceDays < 14) {
                    updateDB = false;
                    build.items = getItemList(buildData.items);
                    build.primaryRunes = getRuneList(buildData.runePrimary);
                    build.secondaryRunes = getRuneList(buildData.runeSecondary);
                    build.tertiaryRunes = getRuneList(buildData.runeTertiary);
                }
                else{
                    common.botLog(`Champion ${args[0]} has an expired build. Days since update: ${differenceDays}, Last update date: ${buildData.date}`);
                }
            }
            if(updateDB) {
                var championForURL = common.cleanName(args[0]);
                build = await helper.getBuild(championForURL);
                if(build == null || build instanceof Error || (build.name != undefined && build.name == "Error")) {
                    message.channel.send(`Complete build not found for ${args[0]}.`);
                    return
                }
                let dateForDatatable = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
                formatBuildForDB(build);
                await this.database.Build.upsert({
                    champion: champion,
                    items: build.items.toString(),
                    runePrimary: build.primaryRunes.toString(),
                    runeSecondary: build.secondaryRunes.toString(),
                    runeTertiary: build.tertiaryRunes.toString(),
                    date: dateForDatatable
                });
            }

            const primaryRuneEmoji = this.bot.emojis.find(emoji => emoji.name == build.primaryRunes[0].toLowerCase());
            const secondaryRuneEmoji = this.bot.emojis.find(emoji => emoji.name == build.secondaryRunes[0].toLowerCase());
            var championName = common.cleanName(args[0]);
            var splashPath = getChampionPhoto(championName);
            message.channel.send({embed: {
                color: common.getRandomDiscordMessageColor(),
                title: args[0].toProper() + " Build",
                thumbnail: {
                    "url": "attachment://icon.png",
                    "height": 120,
                    "width": 200
                },
                fields: [
                    {
                        name: `${primaryRuneEmoji} ${build.primaryRunes[0]} ${primaryRuneEmoji}`,
                        value: `1. ${build.primaryRunes[1]}\n2. ${build.primaryRunes[2]}\n3. ${build.primaryRunes[3]}\n4. ${build.primaryRunes[4]}`,
                        inline: true,
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: true
                    },
                    {
                        name: `${secondaryRuneEmoji} ${build.secondaryRunes[0]} ${secondaryRuneEmoji}`,
                        value: `1. ${build.secondaryRunes[1]}\n2. ${build.secondaryRunes[2]}`,
                        inline: true,
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                    },
                    {
                        name: ":crossed_swords: Items :crossed_swords:",
                        value: `1. ${build.items[0]}\n2. ${build.items[1]}\n3. ${build.items[2]}\n4. ${build.items[3]}\n5. ${build.items[4]}\n6. ${build.items[5]}`,
                        inline: true,
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: true
                    },
                    {
                        name: `:shield: ${build.tertiaryRunes[0]} :shield:`,
                        value: `1. ${build.tertiaryRunes[1]}\n2. ${build.tertiaryRunes[2]}\n3. ${build.tertiaryRunes[3]}`,
                        inline: true
                    }
                ],
                image: {
                    url: "attachment://splash.png"
                }
            },files:[{attachment: `config/photos/champion/${championName.toLowerCase()}.png`, name: 'icon.png'}, {attachment: splashPath, name: 'splash.png'}]});
        }
        catch(e) {
            message.channel.send(`Failed to get data for ${args[0]}.\nSee log for details.`);
            common.botLog(e);
        }
    }
}

function getChampionPhoto(championName) {
    var files = fs.readdirSync('config/photos/champion_tiles/');
    var result = [];
    for(var index = 0; index < files.length; index++) {
        var value = files[index];
        if(value.toLowerCase().includes(championName.toLowerCase())) {
            result.push(value)
        }
    }
    if(result.length == 0) {
        throw new Error(`Missing photo for champion ${championName} in build command`)
    }
    var fileName = result[Math.floor(Math.random() * result.length)];
    var filePath = `config/photos/champion_tiles/${fileName}`;
    return filePath
}

function getItemList(items) {
    let buildList = items.split(",");
    for(let i = 0; i < buildList.length; i++) {
        let item = buildList[i].replace(/-/g, " ");
        item = common.addPossessive(item);
        buildList[i] = item;
    }
    return buildList
}

function getRuneList(runes) {
    let runeList = runes.split(",");
    for(let i = 1; i < runeList.length; i++) {
        let rune = runeList[i].replace(/-/g, " ");
        runeList[i] = rune;
    }
    return runeList
}

function formatBuildForDB(build) {
    for(var key of Object.keys(build)) {
        build[key] = build[key].map(x => x.replace(/'/g, "").replace(/\s/g, "-"));
    }
    return 0
}
