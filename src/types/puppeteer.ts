// puppeteer.ts

export type PuppeteerConfigType = {
    headless: boolean,
    userDataDir: string,
}

export type BrowserConfigType = {
    userAgent: string,
    screenHeight: number,
    screenWidth: number,
    viewportHeight: number,
    viewportWidth: number,
    isMobile: boolean,
}

export interface PuppeteerControllerConfigInterface {
    puppeteerConfig: PuppeteerConfigType,
    browserConfig: BrowserConfigType,
    proxy: string,
}

export interface PuppeteerControllerMainConfigInterface {
    ignoreHTTPSErrors: boolean,
    args: string[],
    executablePath: string,
    headless: boolean,
    userDataDir: string,
}