const common = require('../src/common')
const getRequest = require('../src/getRequests')
//TODO - Finish this
module.exports = {
    name:'leagueStatus',
    async execute(message, args) {
        try {
            var leagueStatus = await getRequest.getStatusOfShard()
            var gameIssues = ''
            var storeIssues = ''
            var websiteIssues = ''
            var clientIssues = ''
            leagueStatus.services.forEach(function(service) {
                service.incidents.forEach(function(issue) {
                    if(service.name == 'Game') {
                        gameIssues += issue.updates[0].content + '\n\n'
                    }
                    else if(service.name == 'Store') {
                        storeIssues += issue.updates[0].content + '\n\n'
                    }
                    else if(service.name == 'Website') {
                        websiteIssues += issue.updates[0].content + '\n\n'
                    }
                    else if(service.name == 'Client') {
                        clientIssues += issue.updates[0].content + '\n\n'
                    }
                })
            })
            message.channel.send({embed: {
                color: Math.floor(Math.random() * 16777214) + 1,
                title: `Riot Server Status`,
                fields: [
                    {
                        name: leagueStatus.services[0].name,
                        value: `Status: ${leagueStatus.services[0].status}\nIssues: ${gameIssues}`,
                        inline: true,
                    },
                    {
                        name: leagueStatus.services[1].name,
                        value: `Status: ${leagueStatus.services[1].status}\nIssues: ${storeIssues}`,
                        inline: true
                    },
                    {
                        name: leagueStatus.services[2].name,
                        value: `Status: ${leagueStatus.services[2].status}\nIssues: ${websiteIssues}`,
                        inline: false,
                    },
                    {
                        name: leagueStatus.services[3].name,
                        value: `Status: ${leagueStatus.services[3].status}\nIssues: ${clientIssues}`,
                        inline: false
                    }
                ]
            }})
        }
        catch(e) {
            common.botLog(e)
            message.channel.send(`Something wrong seems to have happened, check the log.`)
        }
    }
}