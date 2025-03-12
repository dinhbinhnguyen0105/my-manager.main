import path from "path";
import fs from "fs";
import { IPCSettingInterface } from "~/types/ipcs";
import { initSettingState, SettingInterface } from "~/types/setting";

const dbPath = path.join(__dirname, "..", "bin", "db", "setting.json");

const initializeDB = (): void => {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify(initSettingState), { encoding: "utf8" });
    }
};

const readDB = (): SettingInterface => {
    const rawDB: string = fs.readFileSync(dbPath, { encoding: "utf8" });
    return JSON.parse(rawDB);
};

const writeDB = (db: SettingInterface): void => {
    fs.writeFileSync(dbPath, JSON.stringify(db), { encoding: "utf8" });
};

const handleError = (error: unknown, reject: (reason?: any) => void, context: string): void => {
    reject({
        data: null,
        message: `ERROR [${context}]: ${(error as Error).message}`,
        status: 500,
    });
};

const get = (): Promise<IPCSettingInterface> => {
    return new Promise((resolve, reject) => {
        try {
            initializeDB();
            const db: SettingInterface = readDB();
            resolve({
                data: db,
                status: 200,
                message: "Successfully retrieved settings",
            });
        } catch (error) {
            handleError(error, reject, "get");
        }
    });
};

const update = ({ setting }: { setting: SettingInterface }): Promise<IPCSettingInterface> => {
    return new Promise((resolve, reject) => {
        try {
            initializeDB();
            writeDB(setting);
            resolve({
                data: null,
                status: 200,
                message: "Successfully updated settings",
            });
        } catch (error) {
            handleError(error, reject, "update");
        }
    });
};

export {
    get, update,
};