const common = require('../src/common')
const getTime = common.getTime

module.exports = {
    name:'build',
    async execute(message, args, searchPage) {
        try {
            if(!args.length) {
                message.channel.send(`You need to tell me which champion to search for, like '!build Garen'.`)
            }
            else {
                message.channel.send(`I'll get right on that, ${message.author}.`)
                var build = await searchPage.getChampBuild(args[0])
                if(!build.length) {
                    await console.log(`${getTime()}: Error - ${build}`)
                    await message.channel.send(`oWo wats dis, I did a fucko boingo! See the log for details.`)
                }
                else {
                    await message.channel.send(`Your build is going to be:\n ${build}.`)
                }
            }
        }
        catch(e) {
            console.log(`${getTime()}: ${e}`)
        }
    }
}