import path from "path";
import fs from "fs";
import { IPCBotInterface, } from "~/types/ipcs";
import { BotInterface, initBotState } from "~/types/bot";

const dbPath = path.join(__dirname, "..", "bin", "db", "bot.json");

const initializeDB = (): void => {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify(initBotState), { encoding: "utf8" });
    };
};

const readDB = (): BotInterface => {
    const rawDB: string = fs.readFileSync(dbPath, { encoding: "utf8" });
    return JSON.parse(rawDB);
};

const handleError = (error: unknown, reject: (reason?: any) => void, context: string): void => {
    reject({
        data: null,
        message: `ERROR [${context}]: ${(error as Error).message}`,
        status: 500,
    });
};

const bot_get = (): Promise<IPCBotInterface> => {
    return new Promise((resolve, reject) => {
        try {
            initializeDB();
            const db: BotInterface = readDB();
            resolve({
                data: db,
                status: 200,
                message: "Successfully retrieved data from the database [bot]",
            });
        } catch (error) {
            handleError(error, reject, "bot_get");
        };
    });
};

const bot_update = ({ bot }: { bot: BotInterface }): Promise<IPCBotInterface> => {
    return new Promise((resolve, reject) => {
        try {
            initializeDB();
            fs.writeFileSync(dbPath, JSON.stringify(bot), { encoding: "utf8" });
            resolve({
                data: null,
                status: 200,
                message: "Successfully update bot",
            });
        } catch (error) { handleError(error, reject, "updateLikeComment"); };
    });
};

export {
    bot_get,
    bot_update,
};