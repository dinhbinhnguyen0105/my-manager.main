import { UserInterface } from "~/types/user";
import { LikeCommentInterface } from "./bot";
import { SettingInterface } from "./setting";

export interface IPCUserInterface {
    data: UserInterface[] | null,
    status: number,
    message: string,
}

export interface IPCLikeCommentInterface {
    data: LikeCommentInterface | null,
    status: number,
    message: string,
}

export interface IPCSettingInterface {
    data: SettingInterface | null,
    status: number,
    message: string,
}