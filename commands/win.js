const fs = require('fs')

module.exports = {
    name:'win',
    async execute(message, args, botBrowser) {
        await botBrowser.navigate('https://www.google.com/search?q=happy+cat+picture')
        await botBrowser.clickSelector('div.hdtb-mitem:nth-child(2) > a:nth-child(1)')
        var index = await Math.floor(Math.random() * (31 - 1) + 1)
        var selector = `div.rg_bx:nth-child(${index}) > a:nth-child(1) > img:nth-child(2)`
        await botBrowser.wait(1500)
        await botBrowser.screenshot(selector)

        await message.channel.send({
            files: [{
                attachment: './images/tmp.png',
                name: 'tmp.png'
            }]
        })
        .then(console.log)
        .catch(console.error)
        await message.channel.send(`Congrats on your win!`)
    }
}