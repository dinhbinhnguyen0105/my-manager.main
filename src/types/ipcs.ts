import { UserInterface } from "~/types/user";
import { BotInterface } from "./bot";
import { SettingInterface } from "./setting";

export interface IPCUserInterface {
    data: UserInterface[] | null,
    status: number,
    message: string,
}

export interface IPCBotInterface {
    data?: BotInterface | null,
    status: number,
    message: string,
}

export interface IPCSettingInterface {
    data: SettingInterface | null,
    status: number,
    message: string,
}

export interface IPCActionInterface {
    status: number,
    message: string,
}