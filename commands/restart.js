module.exports = {
    name:'restart',
    async execute(message, args) {
        await this.botBrowser.restart()
        await message.channel.send(`My web browser has been restarted.`)
    }
}