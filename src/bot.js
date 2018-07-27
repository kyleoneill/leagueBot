//Package imports
const fs = require('fs')
const Discord = require('discord.js')
const bot = new Discord.Client()

//Custom Imports
const {token} = require('../config/auth.json')
const {leagueKey} = require('../config/auth.json')
const {prefix} = require('../config/config.json')
const common = require('./common')
const getTime = common.getTime

//Bot Browser
const BrowserFunctions = require('./browser')
let DCbotBrowser = new BrowserFunctions()

//Bot Database
const userDBFunctions = require('./databases/userDB')
let userDB = new userDBFunctions()

//Collect bot commands from commands folder
bot.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for(const file of commandFiles) {
    const command = require(`../commands/${file}`)
    bot.commands.set(command.name, command)
}

//On bot ready, start the database and browser
bot.on('ready', async () => {
    await console.log(`${getTime()}: Logging in as: ${bot.user.username}`)
    await userDB.start()
    await DCbotBrowser.start()
    await DCbotBrowser.checkForPics()
});

//Pack objects inside of 'this' for transport to commands
this.botBrowser = DCbotBrowser
this.botDatabase = userDB
this.leagueAPI = leagueKey

//On discord message
bot.on('message', message => {
    if(message.author.bot || !message.content.startsWith(prefix) || !message.guild) return
    const args = message.content.slice(prefix.length).split(/ +/) //Discard prefix, return command and arguments in an array. Vars are split by spaces.
    const command = args.shift() //Removes first var from args (the command) and stores it in const 'command'
    var text = message.content

    if(!bot.commands.has(command)) {
        message.channel.send(`I don't seem to know '!${command}'. Check out '!help' to see what I can do.`)
        return
    }
    try {
        var logMessage = `${getTime()}: User '${message.author.username}' in guild '${message.guild}' issued command '${command}'`
        if(args.length) {
            logMessage += ` with args '${args}'`
        }
        console.log(logMessage)
        bot.commands.get(command).execute.call(this, message, args)
        if(command == 'shutdown' && message.author.username == 'sammie287') {
            bot.destroy()
        }
    }
    catch(e) {
        console.error(`${getTime()}: e`)
        message.channel.send('There was an error trying to execute that command.')
    }
})
bot.login(token)

