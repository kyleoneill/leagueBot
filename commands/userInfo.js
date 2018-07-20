module.exports = {
    name:'userInfo',
    execute(message, args) {
        message.channel.send(`Your name is ${message.author.username}, and you were created at ${message.author.createdAt}`)
    }
}