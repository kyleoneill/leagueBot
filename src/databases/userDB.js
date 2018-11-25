const common = require('../common')
const getRequest = common.httpsGetAsync
const timeStamp = common.getTime
const botLog = common.botLog
const sqlite = require('sqlite')
var db = null

class dbFunctions {
    async start() {
        try{
            db = await sqlite.open('./database.sqlite')
            var row = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name = 'users'`)
            if(row !== undefined) {
                botLog(`SQLite table exists.`)
            }
            else {
                botLog(`SQLite table does not exist, creating a new table.`)
                await db.run("CREATE TABLE users(username TEXT, profileIconId INTEGER, accountId INTEGER, id INTEGER, guildname TEXT, summonerName TEXT, PRIMARY KEY(username, guildname))")
            }
        }
        catch(e) {
            botLog(`${e}`)
        }
    }
    async setName(message, summonerName, key) {
        try{
            var summonerInfo = await getRequest(`https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${key}`)
            //await db.prepare(`INSERT OR REPLACE INTO users VALUES ('${message.author.username}', '${summonerName}')`).run()
            db.run(`INSERT OR REPLACE INTO users (username, profileIconId, accountId, id, guildname, summonerName) VALUES ('${message.author.username}','${summonerInfo.profileIconId}','${summonerInfo.accountId}','${summonerInfo.id}','${message.channel.guild}', '${summonerName}')`)
            botLog(`User ${message.author.username} updated their db information`)
        }
        catch(e) {
            botLog(`${e}`)
        }
    }
    async getName(message) {
        try {
            var row = await db.get(`SELECT summonerName FROM users WHERE username = '${message.author.username}' AND guildname = '${message.channel.guild}'`)
            if(!row){
                return null
            }
            else{
                return row.summonerName
            }
        }
        catch(e) {
            botLog(`${e}`)
        }
    }
    async getAccountInfo(message) {
        try{
            var row = await db.get(`SELECT summonerName, profileIconId, accountId, id FROM users WHERE username = '${message.author.username}' AND guildname = '${message.channel.guild}'`)
            if(!row) {
                return null
            }
            else{
                return row
            }
        }
        catch(e){
            botLog(`${e}`)
        }
    }
    close(){
        db.close()
    }
}

module.exports = dbFunctions