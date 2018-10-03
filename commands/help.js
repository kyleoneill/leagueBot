const {help} = require('../config/config.json')
module.exports = {
    name:'help',
    execute(message, args) {
        var index = 1
        var msg = `My commands include...\n`
        help.forEach(descrption => {
            msg += `${index}: ${descrption}\n`
            index++
        })
        message.channel.send(`${msg}`)
    }
}