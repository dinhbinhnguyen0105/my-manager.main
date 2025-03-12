// services.action.ts
import path from "path";
import { IPCActionInterface } from "~/types/ipcs"
import { SettingInterface } from "~/types/setting";
import { get as getUser } from "./user";
import { get as getSetting } from "./setting";
import getProxy from "~/utils/getProxy";
import { BrowserConfigType, PuppeteerConfigType } from "~/types/puppeteer";
import PuppeteerController from "~/puppeteer/PuppeteerController";

const userDataDirs = path.resolve(__dirname, "..", "bin", "browsers");


const handleError = (error: unknown, reject: (reason?: any) => void, context: string): void => {
    reject({
        message: `ERROR [${context}]: ${(error as Error).message}`,
        status: 500,
    });
};

const openBrowser = ({ id }: { id: string }): Promise<IPCActionInterface> => {
    return new Promise(async (resolve, reject) => {
        try {
            const userRaw = await getUser({ id });
            const settingRaw = await getSetting();
            const user = userRaw.data;
            const setting = settingRaw.data;

            let browserConfig: BrowserConfigType = {
                userAgent: "",
                screenHeight: 0,
                screenWidth: 0,
                viewportHeight: 0,
                viewportWidth: 0,
                isMobile: false,
            };
            let proxy;
            const puppeteerConfig: PuppeteerConfigType = {
                headless: false,
                userDataDir: path.join(userDataDirs, id),
            }
            if (!user) { reject({ status: 500, message: `User with id [${id}] not found.` }) }
            else {
                const _ = user.browser.mobile;
                browserConfig = {
                    ..._,
                    isMobile: setting?.isMobile || false,
                }
            }
            if (setting?.proxy) {
                const urls = setting.proxy.split(",");
                const proxyRaw = await getProxy(urls.map(url => url.trim()));
                proxy = proxyRaw.proxy;
            } else {
                reject({ status: 500, message: `Proxy not found` });
            };

            //puppeteer
            if (proxy && browserConfig && puppeteerConfig) {
                const browserController = new PuppeteerController({
                    browserConfig,
                    puppeteerConfig,
                    proxy,
                })
                await browserController.initBrowser();
            }

        } catch (error) {
            handleError(error, reject, "openBrowser");
        };
    });
};

export {
    openBrowser,
};