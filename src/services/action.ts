// services.action.ts
import path from "path";
import { IPCActionInterface } from "~/types/ipcs"
import { SettingInterface } from "~/types/setting";
import { LikeCommentType } from "~/types/bot";
import { get as getUser } from "./user";
import { get as getSetting } from "./setting";
import getProxy from "~/utils/getProxy";
import { BrowserConfigType, PuppeteerConfigType } from "~/types/puppeteer";
import PuppeteerController from "~/puppeteer/Puppeteer";
import { exit } from "process";
import preparePuppeteerConfig from "~/utils/preparePuppeteerConfig";
import likeCommentController from "./likeCommentController";

const userDataDirs = path.resolve(__dirname, "..", "bin", "browsers");


const handleError = (error: unknown, reject: (reason?: any) => void, context: string): void => {
    reject({
        message: `ERROR [${context}]: ${(error as Error).message}`,
        status: 500,
    });
};

const openBrowser = ({ id, setting }: { id: string, setting: SettingInterface }): Promise<IPCActionInterface> => {
    return new Promise(async (resolve, reject) => {
        try {
            const userRaw = await getUser({ id });
            const user = userRaw.data;

            let browserConfig: BrowserConfigType = {
                userAgent: "",
                screenHeight: 0,
                screenWidth: 0,
                viewportHeight: 0,
                viewportWidth: 0,
                isMobile: false,
            };
            let proxy = null;
            const puppeteerConfig: PuppeteerConfigType = {
                headless: false,
                userDataDir: path.join(userDataDirs, id),
            }
            if (!user) { reject({ status: 500, message: `User with id [${id}] not found.` }) }
            else {
                if (setting?.isMobile) {
                    browserConfig = {
                        ...user.browser.mobile,
                        isMobile: true,
                    };
                } else {
                    browserConfig = {
                        ...user.browser.desktop,
                        isMobile: false,
                    };
                };
            }
            if (setting?.proxy) {
                const urls = setting.proxy.split(",");
                while (urls.length > 0) {
                    const url = urls.pop();
                    if (url) {
                        const proxyRaw = await getProxy(url);
                        if (proxyRaw) {
                            proxy = proxyRaw.proxy;
                            break;
                        } else { continue; };
                    }
                }
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

const botLikeComment = ({ ids, likeComment, setting }: { ids: string[], likeComment: LikeCommentType, setting: SettingInterface }): Promise<IPCActionInterface> => {
    return new Promise(async (resolve, reject) => {
        // console.log({ ids, likeComment, setting });

        while (ids.length > 0) {
            const tasks = [];
            const proxySources = setting.proxy.split(",");
            for (let i = 0; i < setting.process; i++) {
                let proxy = null;
                while (proxySources.length > 0) {
                    const proxySource = proxySources.pop();
                    if (!proxySource) { break; };
                    const proxyRaw = await getProxy(proxySource.trim());
                    if (proxyRaw) {
                        proxy = proxyRaw.proxy;
                        break;
                    } else { continue; };
                };
                if (!proxy) { continue; };
                const id = ids.pop();
                if (!id) { break; };
                const puppeteerConfig = await preparePuppeteerConfig({ id, isMobile: setting.isMobile, proxy })
                if (puppeteerConfig) {
                    tasks.push(puppeteerConfig);
                }
            };

            // console.log({ taskLength: tasks.length });
            // console.log("------ tasks ---------")
            // console.log(tasks);
            if (tasks) {
                await likeCommentController({
                    tasks: tasks,
                    likeComment: likeComment,
                    concurrency: setting.process
                })
            }
            break;
            // handler
        }
    })
}



export {
    openBrowser,
    botLikeComment,
};