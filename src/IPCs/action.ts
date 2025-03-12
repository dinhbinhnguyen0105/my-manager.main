//ipcs.action.ts

import { ipcMain, IpcMainInvokeEvent } from "electron";
import constants from "~/constants";
import { IPCActionInterface } from "~/types/ipcs";
import * as services from "~/services/action"


// action_open_browser
// action_like_comment

const actionIPCs = (): void => {
    ipcMain.handle(constants.ACTION_OPEN_BROWSER, (event: IpcMainInvokeEvent, { id }: { id: string }): Promise<IPCActionInterface> => services.openBrowser({ id }));
}

export default actionIPCs;