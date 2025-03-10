import { ipcMain } from "electron";
import path from "path";
import fs from "fs";
import { APIsInterface } from "@/types";

const dbPath = path.join(__dirname, "..", "bin", "db", "user.json");
const listUser = (): Promise<APIsInterface> => {
    return new Promise((resolve, reject) => {
        try {
            const rawDB = fs.readFileSync(dbPath, { encoding: "utf8" });

        } catch (error) {
            reject({
                data: null,
                message: `ERROR [listUser]: ${(error as string).toString()}`,
                status: 500,
            });
        };
    });
};
// const handleListUser = () => {
//     return new Promise((resolve, reject) => {
//         try {
//             const rawDB = fs.readFileSync(userDBPath, { encoding: "utf8" });
//             const db = JSON.parse(rawDB);
//             resolve({
//                 data: db,
//                 message: "Successfully retrieved data from the database [users]",
//                 statusCode: 200,
//             });
//         } catch (err) {
//             reject({
//                 statusCode: 500,
//                 message: err.toString(),
//             });
//         };
//     });
// };