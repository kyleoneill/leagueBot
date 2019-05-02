const {help} = require('../config/config.json')
module.exports = {
    name:'help',
    execute(message, args) {
        var msg = `My commands include...\n`;
        for(var i = 0; i < help.length; i++) {
            msg += `${i+1}: ${help[i]}\n`;
        }
        message.channel.send(msg);
    }
}