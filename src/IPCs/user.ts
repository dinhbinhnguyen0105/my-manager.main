import { ipcMain } from "electron"
import * as constants from "@/constants";

const userIPCs = () => {
    ipcMain.handle(constants.USER_LIST, () => {
        return new Promise((resolve, reject) => {

        })
    })
}