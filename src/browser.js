const puppeteer = require('puppeteer')
const fs = require('fs')
const timeOutValue = 5000
let page
let browser

function getTimeStamp() {
    var timeStamp = (new Date()).toLocaleString('en-US')
    return timeStamp
}

//kill getChampBuild, add a "GoogleSomething(thingToGoogle)" function which returns the first link
class BrowserFunctions {
    async start() {
        await console.log(`${getTimeStamp()}: Starting browser.`)
        browser = await puppeteer.launch()
        page = await browser.newPage()
        await this.resetPage()
        await console.log(`${getTimeStamp()}: Browser started.`)
    }
    async shutdown() {
        console.log(`${getTimeStamp()}: Shutting down browser.`)
        return browser.close()
    }
    async restart() {
        await this.shutdown()
        await this.start()
    }
    async resetPage() {
        await page.goto('https://www.google.com')
    }
    async navigate(link) {
        await page.goto(link)
    }
    async clickSelector(selector) {
        await page.waitFor(selector, {visible: true, timeout: timeOutValue})
        await page.hover(selector)
        await page.$eval(selector, async(e) => {
            await e.click()
        })
        await page.waitFor(300)
    }
    async waitForSel(selector) {
        await page.waitFor(selector, {visible: true, timeout: timeOutValue})
    }
    async getChampBuild(champName) {
        try {
            await this.navigate('https://www.lolking.net/')
            await page.waitFor(500)

            await this.waitForSel('.suggestive-search-container > form:nth-child(1) > input')
            await page.type('.suggestive-search-container > form:nth-child(1) > input', champName)
            await this.clickSelector('#suggestion-div')
            await page.waitFor(500)

            await this.clickSelector('.champ-tabs > li:nth-child(2) > a:nth-child(1)')
            await page.waitFor(500)
            await this.clickSelector('.lol-panel-body > guide-card:nth-child(2) > a')

            var build = await page.$$eval('ul.item-groups:nth-child(4) > li > div > span:nth-child(2)', spans => {
                var spanList = []
                spans.forEach(span => {
                    spanList.push('\n' + (span.innerHTML).trim())
                })
                return spanList
            })
            await this.resetPage()
            return build
        }
        catch(e) {
            return(e)
        }
    }
}

module.exports = BrowserFunctions


//Mobafire Version
// async getChampBuild(champName) {
//     try {
//         await this.resetPage()

//         await this.waitForSel('#lst-ib')
//         await page.type('#lst-ib', `${champName} build mobafire league`)
//         await this.clickSelector('.jsb > center:nth-child(1) > input:nth-child(1)')

//         await this.waitForSel('#ires')
//         await this.clickSelector('div.g:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h3:nth-child(1) > a:nth-child(1)')

//         await this.clickSelector('a.browse-list__item:nth-child(2)')

//         await this.waitForSel('div.build-box:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(5) > div:nth-child(6) > div:nth-child(6) > div:nth-child(2)')
//         var totalBuild = await page.$$eval('div.self-clear > div.item-wrap.self-clear.float-left', async (divs) => {
//             var buildBuilder = []
//             console.log(divs.length)
//             while(divs.length > 8) {
//                 await divs.pop()
//             }
//             await divs.forEach(async div => {
//                 var buildObj = []
//                 buildObj.name = ((await div.$('h2')).innerHTML).trim()
//                 buildObj.build = await div.$$eval('div:nth-child(2) > div > a > div:nth-child(2) > span', spans => {
//                     spans.forEach(span => {
//                         var text = (' ' + (span.innerHTML).trim())
//                         return text
//                     })
//                 })
//                 await buildBuilder.push(buildObj)
//             });
//             return buildBuilder
//         })
//         await this.resetPage()
//         return totalBuild
//     }
//     catch(e) {
//         return(e)
//     }
// }