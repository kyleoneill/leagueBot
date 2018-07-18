const fs = require('fs')
const Discord = require('discord.js')
const bot = new Discord.Client()
const {token} = require('../config/auth.json')
const {prefix} = require('../config/config.json')

const common = require('./common')
const getTime = common.getTime

const BrowserFunctions = require('./browser')
let leagueSearch = new BrowserFunctions()

bot.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for(const file of commandFiles) {
    const command = require(`../commands/${file}`)
    bot.commands.set(command.name, command)
}

leagueSearch.start()

bot.on('ready', () => {
    console.log(`${getTime()}: Logging in as: ${bot.user.username}`)
});
bot.on('message', message => {
    if(message.author.bot || !message.content.startsWith(prefix)) return
    const args = message.content.slice(prefix.length).split(/ +/) //Discard prefix, return command and arguments in an array. Vars are split by spaces.
    const command = args.shift() //Removes first var from args (the command) and stores it in const 'command'
    var text = message.content

    if(!bot.commands.has(command)) return
    try {
        bot.commands.get(command).execute(message, args, leagueSearch)
        console.log(`${getTime()}: User ${message.author.username} issued command '${command}' with args '${args}'`)
    }
    catch(e) {
        console.error(e)
        message.reply('There was an error trying to execute that command.')
    }
})
bot.login(token)
