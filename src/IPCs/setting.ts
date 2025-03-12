import { ipcMain, IpcMainInvokeEvent } from "electron";
import constants from "~/constants";
import { SettingInterface } from "~/types/setting";
import { IPCSettingInterface } from "~/types/ipcs";
import * as services from "~/services/setting";

const settingIPCs = (): void => {
    ipcMain.handle(constants.SETTING_GET, (): Promise<IPCSettingInterface> => services.get());
    ipcMain.handle(constants.SETTING_UPDATE, (event: IpcMainInvokeEvent, { setting }: { setting: SettingInterface }): Promise<IPCSettingInterface> => services.update({ setting }));
};

export default settingIPCs;
