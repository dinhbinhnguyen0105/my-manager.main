// PuppeteerController.ts
import fs from "fs";
import { ElementHandle, Browser, Page } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import { BrowserConfigType, ConfigInterface } from "~/types/puppeteer";
import { readConfigFile } from "~/utils/helper";

class Puppeteer {
    browser: Browser | null;
    page: Page | null;
    proxyConfigs: { ip: string, port: string, username: string, password: string, };
    browserConfigs: BrowserConfigType;
    mainConfig: {
        ignoreHTTPSErrors: boolean,
        args: string[],
        executablePath: string,
        headless: boolean,
        userDataDir: string,
    }
    constructor(configs: ConfigInterface) {
        puppeteer.use(StealthPlugin());
        this.browser = null;
        this.page = null;
        const [ip, port, username, password] = configs.proxy.split(":");
        this.proxyConfigs = { ip, port, username, password };
        this.browserConfigs = configs.browserConfig;
        const args = [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--window-position=0,0",
            "--ignore-certificate-errors",
            "--ignore-certificate-errors-spki-list",
            "--disable-blink-features=AutomationControlled",
            "--disable-infobars",
            configs.browserConfig.userAgent && `--user-agent=${configs.browserConfig.userAgent}`,//
            `--proxy-server=${this.proxyConfigs.ip}:${this.proxyConfigs.port}`,
        ];
        const executablePath = readConfigFile("EXECUTABLE_PATH");
        if (!executablePath || (executablePath && !fs.existsSync(executablePath))) {
            throw new Error("EXECUTABLE_PATH not found");
        };
        this.mainConfig = {
            ignoreHTTPSErrors: true,
            args: args,
            executablePath: executablePath,
            ...configs.puppeteerConfig,
        };
    };

    async initBrowser() {
        this.browser = await puppeteer.launch(this.mainConfig);
        this.page = await this.browser.newPage();
        if (this.proxyConfigs) {
            await this.page.authenticate({
                username: this.proxyConfigs.username,
                password: this.proxyConfigs.password,
            });
        };
        await this.page.setUserAgent(this.browserConfigs.userAgent);
        await this.page.setExtraHTTPHeaders({ "User-Agent": this.browserConfigs.userAgent });
        await this.page.evaluateOnNewDocument((ua: string) => {
            Object.defineProperty(navigator, "userAgent", { get: () => ua });
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
            Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'vi-VN'] });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
            Object.defineProperty(screen, 'colorDepth', { get: () => 24 });
        }, this.browserConfigs.userAgent);
        await this.page.setViewport({
            width: this.browserConfigs.viewportWidth,
            height: this.browserConfigs.viewportHeight,
            deviceScaleFactor: 1,
            isMobile: this.browserConfigs.isMobile,
            hasTouch: this.browserConfigs.isMobile,
        });
        console.log("Browser info: ", {
            userDataDir: this.mainConfig.userDataDir,
            proxy: `${this.proxyConfigs.ip}:${this.proxyConfigs.port}:${this.proxyConfigs.username}:${this.proxyConfigs.password}`,
            userAgent: this.browserConfigs.userAgent,
        });
        return this.browser;
    }
    async cleanup() {
        try {
            if (this.browser) {
                await this.browser.close();
                console.log("Browser closed successfully.");
                this.browser = null;
                this.page = null;
            } else {
                console.log("No browser instance found.");
            }
        } catch (error) {
            console.error("Error while closing the browser:", error);
        }
    };
    async scrollToElement(element: ElementHandle) {
        try {
            if (!this.page) { return false; };
            await this.page.evaluate((el: Element) => {
                el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }, element);
            // await this.delay(1000, 2000); // Wait for the scroll to complete
            return true;
        } catch (err) {
            console.error("ERROR [scrollToElement]:", err);
            return false;
        }
    }
    async delay(min = 300, max = 1000) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
    }
}

export default Puppeteer;