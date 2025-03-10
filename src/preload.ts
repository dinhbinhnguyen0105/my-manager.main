import { ipcRenderer, contextBridge } from "electron";
import { UserInterface } from "~/types/user";
import { LikeCommentInterface } from "~/types/bot";
import { SettingInterface } from "~/types/setting";
import * as constants from "~/constants";

contextBridge.exposeInMainWorld("electronAPIs", {
    user_list: () => ipcRenderer.invoke(constants.USER_LIST),
    user_get: (id: string) => ipcRenderer.invoke(constants.USER_GET, { id }),
    user_create: (user: UserInterface) => ipcRenderer.invoke(constants.USER_CREATE, { user }),
    user_update: (user: UserInterface) => ipcRenderer.invoke(constants.USER_UPDATE, { user }),
    user_delete: (id: string) => ipcRenderer.invoke(constants.USER_DELETE, { id }),
    user_select: (id: string, isSelected: boolean) => ipcRenderer.invoke(constants.USER_SET_SELECT, { id, isSelected }),
    user_select_all: (isSelected: boolean) => ipcRenderer.invoke(constants.USER_SET_SELECT_ALL, { isSelected }),

    bot_like_comment_get: () => ipcRenderer.invoke(constants.BOT_LIKE_COMMENT_GET),
    bot_like_comment_update: (likeComment: LikeCommentInterface) => ipcRenderer.invoke(constants.BOT_LIKE_COMMENT_UPDATE, { likeComment }),

    setting_get: () => ipcRenderer.invoke(constants.SETTING_GET),
    setting_update: (setting: SettingInterface) => ipcRenderer.invoke(constants.SETTING_UPDATE, { setting }),

    action_open_browser: (id: string) => ipcRenderer.invoke(constants.ACTION_OPEN_BROWSER, { id }),
    action_like_comment: (ids: string[], likeComment: LikeCommentInterface, setting: SettingInterface) => ipcRenderer.invoke(constants.ACTION_LIKE_COMMENT, { ids, likeComment, setting }),
});