const common = require('../src/common');

module.exports = {
    name:'shutdown',
    async execute(message, args) {
        if(message.author.username != 'sammie287') {
            message.channel.send(`You do not have the authority for that command.`);
            return;
        }
    }
}