import path from "path";
import fs from "fs";
import { IPCLikeCommentInterface } from "~/types/ipcs";
import { LikeCommentInterface, BotInterface } from "~/types/bot";

const dbPath = path.join(__dirname, "..", "bin", "db", "bot.json");

const initializeDB = (): void => {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({}), { encoding: "utf8" });
    }
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

const getLikeComment = (): Promise<IPCLikeCommentInterface> => {
    return new Promise((resolve, reject) => {
        try {
            initializeDB();
            const db: BotInterface = readDB();
            const likeAndCommentDB: LikeCommentInterface = db.likeAndComment;
            resolve({
                data: likeAndCommentDB,
                status: 200,
                message: "Successfully retrieved data from the database [LikeAndComment]",
            });
        } catch (error) {
            handleError(error, reject, "getLikeComment");
        }
    });
};

const updateLikeComment = ({ likeComment }: { likeComment: LikeCommentInterface }): Promise<IPCLikeCommentInterface> => {
    return new Promise((resolve, reject) => {
        try {
            initializeDB();
            const db: BotInterface = readDB();
            const newDB: BotInterface = {
                ...db,
                likeAndComment: likeComment,
            };
            fs.writeFileSync(dbPath, JSON.stringify(newDB), { encoding: "utf8" });
            resolve({
                data: null,
                status: 200,
                message: "Successfully update LikeAndComment",
            });
        } catch (error) {
            handleError(error, reject, "updateLikeComment");
        }
    });
};

export {
    getLikeComment,
    updateLikeComment,
};