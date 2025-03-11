import { ipcMain, IpcMainInvokeEvent } from "electron";
import constants from "~/constants";
import { LikeCommentInterface } from "~/types/bot";
import { IPCLikeCommentInterface } from "~/types/ipcs";
import * as services from "~/services/bot";

const botIPCs = (): void => {
    ipcMain.handle(constants.BOT_LIKE_COMMENT_GET, (): Promise<IPCLikeCommentInterface> => services.getLikeComment());
    ipcMain.handle(constants.BOT_LIKE_COMMENT_UPDATE, (event: IpcMainInvokeEvent, { likeComment }: { likeComment: LikeCommentInterface }): Promise<IPCLikeCommentInterface> => services.updateLikeComment({ likeComment }));
};

export default botIPCs;