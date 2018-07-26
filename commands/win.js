const fs = require('fs')
const common = require('../src/common.js')

module.exports = {
    name:'win',
    async execute(message, args) {
        try{
            var index = await Math.floor(Math.random() * 30) + 1
            await message.channel.send({
                files: [{
                    attachment: `./catpics/photo${index}.png`,
                    name: 'temp.png'
                }]
            })
            await message.channel.send('Congrats on your win!')
        }
        catch(e){
            await console.log(`${common.getTime()}: ${e}`)
            await message.channel.send('Something seems to have gone wrong, see the log for info.')
            
        }
    }
}