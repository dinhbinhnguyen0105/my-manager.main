import { ipcRenderer, contextBridge } from "electron";
import { UserInterface } from "~/types/user";
import { LikeCommentInterface } from "~/types/bot";
import { SettingInterface } from "~/types/setting";

contextBridge.exposeInMainWorld("electronAPIs", {
    user_list: () => ipcRenderer.invoke("/user"),
    user_get: (id: string) => ipcRenderer.invoke("/user/get", { id }),
    user_create: (user: UserInterface) => ipcRenderer.invoke("/user/create", { user }),
    user_update: (user: UserInterface) => ipcRenderer.invoke("/user/update", { user }),
    user_delete: (id: string) => ipcRenderer.invoke("/user/delete", { id }),
    user_select: (id: string, isSelected: boolean) => ipcRenderer.invoke("/user/update/select", { id, isSelected }),
    user_select_all: (isSelected: boolean) => ipcRenderer.invoke("/user/update/select_all", { isSelected }),

    bot_like_comment_get: () => ipcRenderer.invoke("/bot/like_comment"),
    bot_like_comment_update: (likeComment: LikeCommentInterface) => ipcRenderer.invoke("/bot/like_comment/update", { likeComment }),

    setting_get: () => ipcRenderer.invoke("/setting"),
    setting_update: (setting: SettingInterface) => ipcRenderer.invoke("/setting/update", { setting }),

    action_open_browser: (id: string, setting: SettingInterface) => ipcRenderer.invoke("/action/open_browser", { id }),
    action_like_comment: (ids: string[], likeComment: LikeCommentInterface, setting: SettingInterface) => ipcRenderer.invoke("/action/like_comment", { ids, likeComment, setting }),
});