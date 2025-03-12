import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid"
import UserAgent from 'user-agents';
import { IPCUserInterface } from "~/types/ipcs";
import { UserInterface } from "~/types/user";

const dbPath = path.join(__dirname, "..", "bin", "db", "user.json");

const initializeDB = (): void => {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify([]), { encoding: "utf8" });
    }
};

const readDB = (): UserInterface[] => {
    const rawDB = fs.readFileSync(dbPath, { encoding: "utf8" });
    return JSON.parse(rawDB);
};

const writeDB = (db: UserInterface[]): void => {
    fs.writeFileSync(dbPath, JSON.stringify(db), { encoding: "utf8" });
};

const handleError = (error: unknown, reject: (reason?: any) => void, context: string): void => {
    reject({
        data: null,
        message: `ERROR [${context}]: ${(error as Error).message}`,
        status: 500,
    });
};

const list = (): Promise<IPCUserInterface> => {
    return new Promise((resolve, reject) => {
        try {
            initializeDB();
            const db = readDB();
            resolve({
                data: db,
                status: 200,
                message: "Successfully retrieved data from the database [users]",
            });
        } catch (error) {
            handleError(error, reject, "list");
        }
    });
};

const get = ({ id }: { id: string }): Promise<{
    data: UserInterface | null,
    status: number,
    message: string,
}> => {
    return new Promise((resolve, reject) => {
        try {
            initializeDB();
            const db = readDB();
            const user = db.find((user: UserInterface) => user.info.id === id);
            if (user) {
                resolve({
                    data: user,
                    status: 200,
                    message: "Successfully retrieved user",
                });
            } else {
                resolve({
                    data: null,
                    status: 404,
                    message: "User not found",
                });
            }
        } catch (error) {
            handleError(error, reject, "get");
        }
    });
};

const create = ({ user }: { user: UserInterface }): Promise<IPCUserInterface> => {
    return new Promise((resolve, reject) => {
        try {
            initializeDB();
            const db = readDB();
            const userId = uuidv4();
            const mobileAgent = new UserAgent({ deviceCategory: "mobile", platform: "iPhone" });
            const desktopAgent = new UserAgent({
                deviceCategory: "desktop",
                platform: "MacIntel",
                // viewportWidth: { min: 1280 }
                viewportWidth: 1280
            });
            user.info.id = userId;
            user.info.createdAt = new Date().toString();
            user.browser = {
                name: userId,
                mobile: {
                    userAgent: mobileAgent.toString(),
                    screenHeight: mobileAgent.data.screenHeight,
                    screenWidth: mobileAgent.data.screenWidth,
                    viewportHeight: mobileAgent.data.viewportHeight,
                    viewportWidth: mobileAgent.data.viewportWidth,
                },
                desktop: {
                    userAgent: desktopAgent.toString(),
                    screenHeight: desktopAgent.data.screenHeight,
                    screenWidth: desktopAgent.data.screenWidth,
                    viewportHeight: desktopAgent.data.viewportHeight,
                    viewportWidth: desktopAgent.data.viewportWidth,
                },
            };
            db.push(user);
            writeDB(db);
            resolve({
                data: null,
                status: 201,
                message: "Successfully created user",
            });
        } catch (error) {
            handleError(error, reject, "create");
        }
    });
};

const update = ({ user }: { user: UserInterface }): Promise<IPCUserInterface> => {
    return new Promise((resolve, reject) => {
        try {
            initializeDB();
            const db = readDB();
            const index = db.findIndex((u: UserInterface) => u.info.id === user.info.id);
            if (index !== -1) {
                db[index] = user;
                writeDB(db);
                resolve({
                    data: null,
                    status: 200,
                    message: "Successfully updated user",
                });
            } else {
                resolve({
                    data: null,
                    status: 404,
                    message: "User not found",
                });
            }
        } catch (error) {
            handleError(error, reject, "update");
        }
    });
};

const del = ({ id }: { id: string }): Promise<IPCUserInterface> => {
    return new Promise((resolve, reject) => {
        try {
            initializeDB();
            const db = readDB();
            const newDB = db.filter((user: UserInterface) => user.info.id !== id);
            if (newDB.length === db.length) {
                resolve({
                    data: null,
                    status: 404,
                    message: "User not found",
                });
                return;
            }
            writeDB(newDB);
            resolve({
                data: null,
                status: 200,
                message: "Successfully deleted user",
            });
        } catch (error) {
            handleError(error, reject, "del");
        }
    });
};

const select = ({ id, isSelected }: { id: string, isSelected: boolean }): Promise<IPCUserInterface> => {
    return new Promise((resolve, reject) => {
        try {
            initializeDB();
            const db = readDB();
            const index = db.findIndex((u: UserInterface) => u.info.id === id);
            if (index !== -1) {
                db[index].actions.isSelected = isSelected;
                writeDB(db);
                resolve({
                    data: null,
                    status: 200,
                    message: "Successfully updated users",
                });
            } else {
                resolve({
                    data: null,
                    status: 404,
                    message: "User not found",
                });
            }
        } catch (error) {
            handleError(error, reject, "select");
        }
    });
};

const selectAll = ({ isSelected }: { isSelected: boolean }): Promise<IPCUserInterface> => {
    return new Promise((resolve, reject) => {
        try {
            initializeDB();
            const db = readDB();
            const newDB = db.map(user => ({
                ...user,
                actions: {
                    ...user.actions,
                    isSelected: isSelected,
                }
            }));
            writeDB(newDB);
            resolve({
                data: null,
                status: 200,
                message: "Successfully updated user",
            });
        } catch (error) {
            handleError(error, reject, "selectAll");
        }
    });
};

export {
    list,
    get,
    create,
    update,
    del,
    select,
    selectAll,
};