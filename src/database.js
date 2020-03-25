const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'leagueBotDB.sqlite'
})

const Model = Sequelize.Model;

class User extends Model {}
User.init({
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    profileIconId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    puuid: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    accountId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id: {
        type: Sequelize.INTEGER,
        allowNull: false       
    },
    summonerName: {
        type: Sequelize.STRING,
        allowNull: false  
    }
}, {
    sequelize,
    modelName: 'user'
})

class Build extends Model{}
Build.init({
    champion: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    items: {
        type: Sequelize.STRING,
        allowNull: false
    },
    runePrimary: {
        type: Sequelize.STRING,
        allowNull: false
    },
    runeSecondary: {
        type: Sequelize.STRING,
        allowNull: false
    },
    runeTertiary: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'build'
})

class Counter extends Model{}
Counter.init({
    champion: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    counters: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'counter'
})

sequelize.sync().then(() => {
    console.log("Database and tables created");
})
module.exports = {
    User,
    Build,
    Counter
}