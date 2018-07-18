const common = require('../src/common')
const getTime = common.getTime

module.exports = {
    name:'time',
    execute(message, args) {
        message.channel.send(`The current time is ${getTime()}`)
    }
}