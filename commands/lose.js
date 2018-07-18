const {insults} = require('../config/config.json')
module.exports = {
    name:'lose',
    execute(message, args) {
        var index = Math.floor(Math.random() * insults.length)
        message.channel.send(`${insults[index]}`)
    }
}