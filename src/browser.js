const puppeteer = require('puppeteer')
const common = require('./common')
const timeStamp = common.getTime
const fs = require('fs')
const timeOutValue = 5000
let page
let browser

class BrowserFunctions {
    async start() {
        await console.log(`${timeStamp()}: Starting browser.`)
        browser = await puppeteer.launch()
        //browser = await puppeteer.launch({headless: false})
        page = await browser.newPage()
        page.setViewport({width: 1920, height: 1080})
        await this.resetPage()
        await console.log(`${timeStamp()}: Browser started.`)
    }
    async shutdown() {
        await console.log(`${timeStamp()}: Shutting down browser.`)
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
        await page.waitFor(500)
    }
    async waitForSel(selector) {
        await page.waitFor(selector, {visible: true, timeout: timeOutValue})
    }
    async wait(ms) {
        await page.waitFor(ms)
    }
    async getInnerHTML(selector) {
        await this.waitForSel(selector)
        var HTML = await page.$eval(selector, (e) => {
            return (e.innerHTML).trim()
        })
        return HTML
    }
    async screenshot(selector) {
        await this.waitForSel(selector)
        await this.clickSelector(selector)
        await this.wait(1000)
        var img = await page.$('div.irc_c:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a:nth-child(1) > img:nth-child(1)')
        await img.screenshot({
            path:'./images/tmp.png',
            omitBackground: true,
        })
    }
    async debugScreenshot() {
        await page.screenshot({path: './images/debug.png'})
    }
}

module.exports = BrowserFunctions
