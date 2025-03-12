import { ipcMain, IpcMainInvokeEvent } from "electron";
import constants from "~/constants";
import { UserInterface } from "~/types/user";
import { IPCUserInterface } from "~/types/ipcs";
import * as services from "~/services/user";

const userIPCs = (): void => {
    ipcMain.handle(constants.USER_LIST, (): Promise<IPCUserInterface> => services.list());
    ipcMain.handle(constants.USER_GET, (event: IpcMainInvokeEvent, { id }: { id: string }): Promise<{
        data: UserInterface | null,
        status: number,
        message: string,
    }> => services.get({ id }));
    ipcMain.handle(constants.USER_CREATE, (event: IpcMainInvokeEvent, { user }: { user: UserInterface }): Promise<IPCUserInterface> => services.create({ user }));
    ipcMain.handle(constants.USER_UPDATE, (event: IpcMainInvokeEvent, { user }: { user: UserInterface }): Promise<IPCUserInterface> => services.update({ user }));
    ipcMain.handle(constants.USER_DELETE, (event: IpcMainInvokeEvent, { id }: { id: string }): Promise<IPCUserInterface> => services.del({ id }));
    ipcMain.handle(constants.USER_SET_SELECT, (event: IpcMainInvokeEvent, { id, isSelected }: { id: string, isSelected: boolean }): Promise<IPCUserInterface> => services.select({ id, isSelected }));
    ipcMain.handle(constants.USER_SET_SELECT_ALL, (event: IpcMainInvokeEvent, { isSelected }: { isSelected: boolean }): Promise<IPCUserInterface> => services.selectAll({ isSelected }));
};

export default userIPCs;

