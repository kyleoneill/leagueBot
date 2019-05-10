const common = require('../common');
const botLog = common.botLog;
const sqlite = require('sqlite');
var db = null;

class dbFunctions {
    async start() {
        try{
            db = await sqlite.open('./counter.sqlite');
            var row = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name = 'counterTable'`);
            if(row !== undefined) {
                botLog(`counterTable SQLite table exists.`);
            }
            else {
                botLog(`counterTable SQLite table does not exist, creating a new table.`);
                await db.run("CREATE TABLE counterTable(champion TEXT, counters TEXT, date TEXT, PRIMARY KEY(champion))");
            }
        }
        catch(e) {
            botLog(e);
        }
    }
    async getCounter(champion) {
        try{
            var row = await db.get(`SELECT counters, date FROM counterTable WHERE champion = '${champion}'`);
            if(row){
                return row;
            }
            else{
                return null;
            }
        }
        catch(e){
            botLog(`${e}`);
        }
    }
    async setCounter(champion, counters, date) {
        try{
            await db.run(`INSERT OR REPLACE INTO counterTable (champion, counters, date) VALUES ('${champion}','${counters}','${date}')`);
            botLog(`Updated counter information for champion ${champion}`);
        }
        catch(e){
            botLog(`${e}`);
        }
    }
    close(){
        db.close();
        botLog(`counterTable database closed.`);
    }
}

module.exports = dbFunctions