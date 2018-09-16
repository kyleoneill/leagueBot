const common = require('../common')
const timeStamp = common.getTime
const botLog = common.botLog
const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('./database.sqlite')

class dbFunctions {
    start() {
        try{
            db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name = 'users'`, (error, row) => {
                if(row !== undefined) {
                    botLog(`SQLite table exists.`)
                }
                else {
                    botLog(`SQLite table does not exist, creating a new table.`)
                    db.run("CREATE TABLE users(username TEXT, favChamp TEXT)")
                }
            })
        }
        catch(e) {
            botLog(`${e}`)
        }
    }
    async set(message, champName) {
        try{
            await db.prepare(`INSERT OR REPLACE INTO users VALUES ('${message.author.username}', '${escape(champName)}')`).run()
        }
        catch(e) {
            botLog(`${e}`)
        }
    }
    async get(message, callback) {
        try {
            //var info
            await db.get(`SELECT * FROM users WHERE username == '${message.author.username}'`, async (error, row) => {
                try{
                    callback(row.favChamp)
                }
                catch(e){
                    callback(null)
                }
            })
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