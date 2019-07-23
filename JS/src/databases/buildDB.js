const common = require('../common');
const botLog = common.botLog;
const sqlite = require('sqlite');
var db = null;

class dbFunctions {
    async start() {
        try{
            db = await sqlite.open('./build.sqlite');
            var row = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name = 'buildTable'`);
            if(row !== undefined) {
                botLog(`buildTable SQLite table exists.`);
            }
            else {
                botLog(`buildTable SQLite table does not exist, creating a new table.`);
                await db.run("CREATE TABLE buildTable(champion TEXT, items TEXT, runePrimary TEXT, runeSecondary TEXT, date TEXT, PRIMARY KEY(champion))");
            }
        }
        catch(e) {
            botLog(e);
        }
    }
    async getBuild(champion) {
        try{
            var row = await db.get(`SELECT items, runePrimary, runeSecondary, date FROM buildTable WHERE champion = '${champion}'`);
            if(row){
                return row;
            }
            else{
                return null;
            }
        }
        catch(e){
            botLog(e);
        }
    }
    async setBuild(champion, items, runePrimary, runeSecondary, date) {
        try{
            let query = `INSERT OR REPLACE INTO buildTable (champion, items, runePrimary, runeSecondary, date) VALUES ('${champion}','${items}', '${runePrimary}', '${runeSecondary}', '${date}')`;
            await db.run(query);
            botLog(`Updated build information for champion ${champion}`);
        }
        catch(e){
            botLog(e);
        }
    }
    close(){
        db.close();
        botLog(`buildTable database closed.`);
    }
}

module.exports = dbFunctions