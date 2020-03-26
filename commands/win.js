const common = require('../src/common.js');
const r2 = require('r2');
const querystring = require('querystring');

module.exports = {
    name:'win',
    async execute(message, args) {
        var images = await loadImage.call(this);
        var image = images[0];
        message.channel.send({ files: [ image.url ] } );
        message.channel.send('Congrats on your win!');
    }
}

async function loadImage() {
    var headers = {
        'X-API-KEY': process.env.CATKEY,
    };
    var query_params = {
        'mime_types':'jpg,png', //we only want static images as Discord doesn't like gifs
        'size':'small',   //get the small images as the size is prefect for Discord's 390x256 limit
        'limit' : 1       //only need one
    };
    let queryString = querystring.stringify(query_params); //convert this obejc to query string 

    try {
        let _url = `https://api.thedogapi.com/v1/images/search?${queryString}`;
        var response = await r2.get(_url , {headers} ).json;
        return response;
    }
    catch (e) {
        common.botLog(e);
        message.channel.send(`Something wrong seems to have happened, check the log.`);
    }
}
