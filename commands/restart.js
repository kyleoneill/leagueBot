module.exports = {
    name:'restart',
    async execute(message, args, botBrowser) {
        await botBrowser.restart()
        await message.channel.send(`My web browser has been restarted.`)
    }
}