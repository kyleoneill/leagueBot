module.exports = {
    name:'userInfo',
    execute(message, args, searchPage) {
        message.channel.send(`Your name is ${message.author}, and you were created at ${message.author.createdAt}`)
    }
}