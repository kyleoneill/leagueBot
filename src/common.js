const fs = require('fs')
const {usernames} = require('../config/config.json')
const auth = require('../config/auth.json')
const encoding = 'utf8'

if (!String.prototype.toProper) {
    Object.defineProperty(String.prototype, 'toProper', {
        value: function() {
            var traditionalToProper = this.charAt(0).toUpperCase() + this.substr(1)
            if(traditionalToProper.indexOf(' ') > -1){
                var index = traditionalToProper.indexOf(' ')
                traditionalToProper = traditionalToProper.substr(0, index) + ' ' + traditionalToProper.charAt(index+1).toUpperCase() + traditionalToProper.substr(index+2)
            }
            if(traditionalToProper.indexOf(`'`) > -1){
                var index = traditionalToProper.indexOf(`'`)
                traditionalToProper = traditionalToProper.substr(0, index) + `'` + traditionalToProper.charAt(index+1).toUpperCase() + traditionalToProper.substr(index+2)
            }
            return traditionalToProper
        }
    })
}

module.exports = {
    getTime: function() {
        var timeStamp = (new Date()).toLocaleString('en-US')
        return timeStamp
    },
    titleCase: function(str){
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        // Directly return the joined string
        return splitStr.join(' '); 
    },
    cleanName: function(str){
        str = str.replace(" ","")
        str = str.replace(".", "")
        str = str.replace("'", "")
        return str.toLowerCase()
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
    },
    botLog: function(msg) {
        var output = `${module.exports.getTime()}: ${msg}`
        console.log(output)
        output += '\n'
        const path = 'log.txt'
        try{
            if(!fs.existsSync(path)){
                fs.writeFileSync(path, '', encoding, (err) => {
                    if(err) throw err
                })
            }
            fs.appendFileSync(path, output, encoding, (err) => {
                if(err) throw err
            })
        }
        catch(e){
            console.log(`${module.exports.getTime()}: Error saving log file.\n${e}`)
        }
    },
    noName: function() {
        return(`You have not set a username. Set one like this: !setName ${usernames[Math.floor(Math.random() * usernames.length)]}`)
    }
}