//ipcs.action.ts

import { ipcMain, IpcMainInvokeEvent } from "electron";
import constants from "~/constants";
import { IPCActionInterface } from "~/types/ipcs";
import * as services from "~/services/action"
import { SettingInterface } from "~/types/setting";
import { LikeCommentType } from "~/types/bot";


// action_open_browser
// action_like_comment

const actionIPCs = (): void => {
    ipcMain.handle(constants.ACTION_OPEN_BROWSER, (event: IpcMainInvokeEvent, { id, setting }: { id: string, setting: SettingInterface }): Promise<IPCActionInterface> => services.openBrowser({ id, setting }));
    ipcMain.handle(constants.ACTION_LIKE_COMMENT, (event: IpcMainInvokeEvent, { ids, likeComment, setting }: { ids: string[], likeComment: LikeCommentType, setting: SettingInterface }): Promise<IPCActionInterface> => services.botLikeComment({ ids, likeComment, setting }));

}

export default actionIPCs;