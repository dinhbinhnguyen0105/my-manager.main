import { ipcMain, IpcMainInvokeEvent } from "electron";
import constants from "~/constants";
import { BotInterface, LikeCommentType } from "~/types/bot";
import { IPCBotInterface } from "~/types/ipcs";
import * as services from "~/services/bot";

const botIPCs = (): void => {
    ipcMain.handle(constants.BOT_GET, (): Promise<IPCBotInterface> => services.bot_get());
    ipcMain.handle(constants.BOT_UPDATE, (event: IpcMainInvokeEvent, { bot }: { bot: BotInterface }): Promise<IPCBotInterface> => services.bot_update({ bot }));
};

export default botIPCs;