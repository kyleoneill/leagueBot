const fs = require('fs')

const searchLink = 'https://www.google.com/search?q=happy+cat+picture'
const imageButtonSel = 'div.hdtb-mitem:nth-child(2) > a:nth-child(1)'

module.exports = {
    name:'win',
    async execute(message, args, botBrowser) {
        try {
            await botBrowser.navigate(searchLink)
            await botBrowser.clickSelector(imageButtonSel)

            //Select a random image on the image search page
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
            await message.channel.send(`Congrats on your win!`)
        }
        catch(e){
            await message.channel.send(`The internet isn't playing nice with me, please try again.`)
            await console.log(e)
        }
    }
}