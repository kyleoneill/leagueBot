const https = require('https')
module.exports = {
    getTime: function() {
        var timeStamp = (new Date()).toLocaleString('en-US')
        return timeStamp
    },
    httpsGetAsync: function(url) {
        return new Promise((resolve, reject) => {
            https.get(url, (response) => {
                let data = ''
                response.on('data', (chunk) => {
                    data += chunk
                })
                response.on('end', () => {
                    resolve(JSON.parse(data))
                })
            }).on('error', reject)
        })
    },
    unpackMap: function(map) {
        var mapValues = map.values()
        var list = []
        var isDone = false
        while(!isDone){
            var tmp = mapValues.next()
            if(tmp.value != undefined){
                list.push(tmp.value)
            }
            isDone = tmp.done
        }
        return list
    }
}