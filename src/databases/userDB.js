const puppeteer = require('puppeteer')
const common = require('../common')
const timeStamp = common.getTime
const sqlite = require('better-sqlite3')
const sql = new sqlite('./database.sqlite')

class dbFunctions {
    start() {
        try{
            const table = sql.prepare(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'users';`).get();
            if (!table['count(*)']) {
                // If the table isn't there, create it and setup the database correctly.
                sql.prepare(`CREATE TABLE users (id TEXT PRIMARY KEY, username TEXT, favChamp TEXT);`).run();
                // Ensure that the "id" row is always unique and indexed.
                sql.prepare(`CREATE UNIQUE INDEX idx_users_id ON users (id);`).run();
                sql.pragma("synchronous = 1");
                sql.pragma("journal_mode = wal");
            }
        }
        catch(e) {
            console.log(`${timeStamp()}: ${e}`)
        }
    }
    set(message, champName) {
        try{
            sql.prepare(`INSERT OR REPLACE INTO users VALUES ('${message.author.id}-${message.guild.id}', '${message.author.username}', '${champName}')`).run()
        }
        catch(e) {
            console.log(`${timeStamp()}: ${e}`)
        }
    }
    get() {
        try {
            return sql.prepare(`SELECT * FROM users`).get()
        }
        catch(e) {
            console.log(`${timeStamp()}: ${e}`)
        }
    }
}

module.exports = dbFunctions