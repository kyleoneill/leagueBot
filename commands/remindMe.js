const common = require('../src/common')
const getTime = common.getTime

module.exports = {
    name:'remindMe',
    execute(message, args) {
        /**
         * 
         * remindMe will be used to make reminders. A user will ask to be reminded about something,
         * their reminder will be recorded in the sqlite database with four variables.
         * Reminder owner, reminder, time sent, time to be reminded at
         * In main bot.js file, add a check every x seconds to see if reminders are ready to be sent
         */
        message.channel.send(`This is a placeholder message.`)
    }
}