require('dotenv').config();
//Package imports
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();

//Custom Imports
const config = require('../config/config.json');
const common = require('./common');
const getTime = common.getTime;
const botLog = common.botLog;

//Bot Database
const {User, Build, Counter} = require('./database');
this.database = {User, Build, Counter};

//Collect bot commands from commands folder
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`../commands/${file}`);
    bot.commands.set(command.name.toLowerCase(), command);
}

//On bot ready, start the database
bot.on('ready', async function() {
    try{
        botLog(`~~~~~Bot Started~~~~~`);
        botLog(`Logged in as: ${bot.user.username}`);
        await bot.user.setActivity("Garen jungle");
    }
    catch(e){
        botLog(e);
    }
});

//Pack objects inside of 'this' for transport to commands
this.guildList = bot.guilds;
this.bot = bot;

//On discord message
bot.on('message', async message => {
    if(message.author.bot || !message.content.startsWith(config.prefix) || !message.guild) return

    const index = message.content.indexOf(' '); //Get index of first space in message. If none, return -1
    var command = '';
    var args = [];
    if(index == -1){ //If no spaces in message, just get command
        command = message.content.slice(config.prefix.length);
    }
    else{ //Else, command is everything after prefix and before first space. Args are everything after first space, split by ', '
        command = message.content.slice(config.prefix.length, index);
        args = message.content.slice(1 + index).split(', ');
    }

    command = command.toLowerCase();

    if(!bot.commands.has(command)) {
        message.channel.send(`I don't seem to know '!${command}'. Check out '!help' to see what I can do.`);
        botLog(`User ${message.author.username} tried to execute command '${command}'.`);
        return;
    }
    try {
        var logMessage = `${getTime()}: User '${message.author.username}' in guild '${message.guild}' issued command '${command}'`;
        if(args.length) {
            logMessage += ` with args '${args}'`;
        }
        botLog(logMessage);
        await bot.commands.get(command).execute.call(this, message, args);
        if(command == 'shutdown' && message.author.username == 'sammie287') {
            botLog('~~~~~Bot shutting down~~~~~');
            bot.destroy();
        }
    }
    catch(e) {
        botLog(e);
        message.channel.send('There was an error trying to execute that command.');
    }
})
bot.login(process.env.TOKEN);
