import path from "path";
import fs from "fs";
import { PuppeteerConfigType, ConfigInterface } from "~/types/puppeteer";
import { UserInterface } from "~/types/user";

const dbPath = path.join(__dirname, "..", "bin", "db", "user.json");

const preparePuppeteerConfig = async ({ id, isMobile, proxy }: { id: string, isMobile: boolean, proxy: string }): Promise<ConfigInterface | null> => {
    return new Promise(async (resolve, reject) => {
        try {
            const rawDB = fs.readFileSync(dbPath, { encoding: "utf8" });
            const users: UserInterface[] = JSON.parse(rawDB);
            const user = users.find(user => user.info.id === id);

            if (!user) {
                console.error(`User with id[${id}] not found.`);
                reject(null);
            } else {
                const puppeteerConfig: PuppeteerConfigType = {
                    headless: false,
                    userDataDir: path.join(path.resolve(__dirname, "..", "bin", "browsers"), id),
                };
                resolve({
                    puppeteerConfig: puppeteerConfig,
                    proxy: proxy,
                    browserConfig: isMobile ? { ...user.browser.mobile, isMobile: true } : { ...user.browser.desktop, isMobile: false },
                });
            };
        } catch (error) {
            console.error(error);
            reject(null);
        };
    });
};

export default preparePuppeteerConfig;
