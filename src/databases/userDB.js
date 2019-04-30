const common = require('../common')
const getRequest = require('../getRequests')
const botLog = common.botLog
const sqlite = require('sqlite')
var db = null

class dbFunctions {
    async start() {
        try{
            db = await sqlite.open('./database.sqlite')
            var row = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name = 'users'`)
            if(row !== undefined) {
                botLog(`userDB SQLite table exists.`)
            }
            else {
                botLog(`userDB SQLite table does not exist, creating a new table.`)
                await db.run("CREATE TABLE users(username TEXT, profileIconId INTEGER, puuid INTEGER, accountId INTEGER, id INTEGER, guildname TEXT, summonerName TEXT, PRIMARY KEY(username, guildname))")
            }
        }
        catch(e) {
            botLog(`${e}`)
        }
    }
    async setSummoner(message, summonerName, key) {
        try{
            var summonerInfo = await getRequest.getSummonerByName(summonerName)
            if(summonerInfo == null) {
                throw new Error(`No information returned for summoner ${summonerName}`)
            }
            await db.run(`INSERT OR REPLACE INTO users (username, profileIconId, puuid, accountId, id, guildname, summonerName) VALUES ('${message.author.username}','${summonerInfo.profileIconId}','${summonerInfo.puuid}','${summonerInfo.accountId}','${summonerInfo.id}','${message.channel.guild}', '${summonerName}')`)
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
            var row = await db.get(`SELECT summonerName, profileIconId, puuid, accountId, id FROM users WHERE username = '${message.author.username}' AND guildname = '${message.channel.guild}'`)
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
        botLog(`userDB database closed.`)
    }
}

module.exports = dbFunctions