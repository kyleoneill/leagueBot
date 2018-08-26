const fs = require('fs')
const common = require('../src/common.js')
const r2 = require('r2')
const querystring = require('querystring')

module.exports = {
    name:'win',
    async execute(message, args) {
        // try{
        //     var index = await Math.floor(Math.random() * 50) + 1
        //     await message.channel.send({
        //         files: [{
        //             attachment: `./catpics/photo${index}.png`,
        //             name: 'temp.png'
        //         }]
        //     })
        //     await message.channel.send('Congrats on your win!')
        // }
        // catch(e){
        //     await console.log(`${common.getTime()}: ${e}`)
        //     await message.channel.send('Something seems to have gone wrong, see the log for info.')
            
        // }
        var images = await loadImage.call(this)
        var image = images[0]
        message.channel.send({ files: [ image.url ] } )
        message.channel.send('Congrats on your win!')
    }
}

async function loadImage() {
    var headers = {
        'X-API-KEY': this.catAPI,
    }
    var query_params = {
    //'has_breeds':true, // we only want images with at least one breed data object - name, temperament etc
    'mime_types':'jpg,png', // we only want static images as Discord doesn't like gifs
    'size':'small',   // get the small images as the size is prefect for Discord's 390x256 limit
    'limit' : 1       // only need one
    }
    // convert this obejc to query string 
    let queryString = querystring.stringify(query_params);

    try {
    // construct the API Get request url
    let _url = `https://api.thecatapi.com/v1/images/search?${queryString}`
    // make the request passing the url, and headers object which contains the API_KEY
    var response = await r2.get(_url , {headers} ).json
    } catch (e) {
        console.log(`${getTime()}: ${e}`)
        message.channel.send(`Something wrong seems to have happened, check the log.`)
    }
    return response;
}