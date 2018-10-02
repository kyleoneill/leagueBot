const common = require('../common')
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
                await db.run("CREATE TABLE users(username TEXT, summonerName TEXT)")
            }
        }
        catch(e) {
            botLog(`${e}`)
        }
    }
    async set(message, summonerName) {
        try{
            //await db.prepare(`INSERT OR REPLACE INTO users VALUES ('${message.author.username}', '${summonerName}')`).run()
            db.run(`INSERT OR REPLACE INTO users (username, summonerName) VALUES ('${message.author.username}', '${summonerName}')`)
        }
        catch(e) {
            botLog(`${e}`)
        }
    }
    async get(message) {
        try {
            var row = await db.get(`SELECT summonerName FROM users WHERE username = '${message.author.username}'`)
            return row.summonerName
        }
        catch(e) {
            botLog(`${e}`)
        }
    }
    close(){
        db.close()
    }
}

module.exports = dbFunctions