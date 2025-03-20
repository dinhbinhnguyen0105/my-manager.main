import { LikeCommentType } from "~/types/bot";
import { SettingInterface } from "~/types/setting";

const actionController = ({ ids, setting, actionName, action }:
    {
        ids: string[],
        setting: SettingInterface,
        action: LikeCommentType | null,
        actionName: string
    }
) => {


    // const process = setting.proxy

    switch (actionName) {
        case "likeComment": {
            // setting.proxy
            while (ids.length > 0) {
                const configs = [];
                for (let i = 0; i < setting.process; i++) {

                }
            }
        }
        default: throw new Error("Invalid action name");
    };
}

export default actionController;