const fs = require('fs')
const https = require('https')
const nodemailer = require('nodemailer')
const auth = require('../config/auth.json')
const encoding = 'utf8'
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
    emailLog: function(){
        const path = 'log.txt'
        var emailBody = null
        if(!fs.existsSync(path)){
            fs.writeFileSync(path, '', encoding, (err) => {
                if(err) throw err
            })
            emailBody = "Log file not found."
        }
        else {
            emailBody = fs.readFileSync(path, 'utf8')
        }
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: auth.botEmail,
            pass: auth.botPass
            }
        })
        
        var mailOptions = {
            from: auth.botEmail,
            to: auth.myEmail,
            subject: 'leagueBot Log',
            text: `Automatically generated email from leagueBot`,
            attachments: {filename:'log.txt',path:'log.txt'}
        }
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(`Error Sending Email\n${error}`)
            } else {
            console.log('Email sent: ' + info.response)
            module.exports.botLog(`Log file emailed successfully`)
            }
        })
    }
}