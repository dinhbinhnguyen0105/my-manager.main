export interface APIsInterface {
    data: [] | null,
    status: number,
    message: string,
}

export type ReactionsType = "like" | "love" | "haha" | "wow" | "sad" | "angry";
export type NewsFeedType = {
    isSelected: boolean,
    value: number,
    like: {
        isSelected: boolean,
        value: number,
    },
    comment: {
        isSelected: boolean,
        value: number,
    }
};
export type WatchType = {
    isSelected: boolean,
    value: number,
    like: {
        isSelected: boolean,
        value: number,
    },
    comment: {
        isSelected: boolean,
        value: number,
    }
};
export type GroupType = {
    isSelected: boolean,
    value: number,
    like: {
        isSelected: boolean,
        value: number,
    },
    comment: {
        isSelected: boolean,
        value: number,
    }
};
export type FriendType = {
    isSelected: boolean,
    value: number,
    like: {
        isSelected: boolean,
        value: number,
    },
    comment: {
        isSelected: boolean,
        value: number,
    },
    poke: {
        isSelected: boolean,
        value: number,
    },
    pokeBack: {
        isSelected: boolean,
        value: number,
    },
};
export type PageType = {
    isSelected: boolean,
    value: number,
    url: string,
    like: {
        isSelected: boolean,
        value: number,
    },
    comment: {
        isSelected: boolean,
        value: number,
    },
    invite: {
        isSelected: boolean,
        value: number,
    }
};
export type MarketplaceType = {
    isSelected: boolean,
};
export type NotificationType = {
    isSelected: boolean,
};
export type SearchType = {
    isSelected: boolean,
};

export interface LikeAndCommentInterface {
    isSelected: boolean,
    newsFeed: NewsFeedType,
    watch: WatchType,
    group: GroupType,
    friend: FriendType,
    page: PageType,
    marketplace: MarketplaceType,
    notification: NotificationType,
    search: SearchType,
}

export interface BotInterface {
    likeAndComment: LikeAndCommentInterface,
}

const initLikeAndCommentState: LikeAndCommentInterface = {
    isSelected: false,
    newsFeed: {
        isSelected: false,
        value: 0,
        like: { isSelected: false, value: 0 },
        comment: { isSelected: false, value: 0 },
    },
    watch: {
        isSelected: false,
        value: 0,
        like: { isSelected: false, value: 0 },
        comment: { isSelected: false, value: 0 },
    },
    group: {
        isSelected: false,
        value: 0,
        like: { isSelected: false, value: 0 },
        comment: { isSelected: false, value: 0 },
    },
    friend: {
        isSelected: false,
        value: 0,
        like: { isSelected: false, value: 0 },
        comment: { isSelected: false, value: 0 },
        poke: { isSelected: false, value: 0 },
        pokeBack: { isSelected: false, value: 0 }
    },
    page: {
        isSelected: false,
        value: 0,
        url: "",
        like: { isSelected: false, value: 0 },
        comment: { isSelected: false, value: 0 },
        invite: { isSelected: false, value: 0 },
    },
    marketplace: { isSelected: false },
    notification: { isSelected: false },
    search: { isSelected: false },
};
const initBotState: BotInterface = {
    likeAndComment: initLikeAndCommentState,
}

export interface UserInterface {
    info: {
        id: string,
        username: string,
        uid: string,
        password: string,
        twoFA: string,
        email: string,
        emailPassword: string,
        phoneNumber: string,
        birthDay: string,
        gender: string,
        avatar: string,
        group: string,
        type: string,
        note: string,
        status: string,
        createdAt: string,
        updatedAt: string,
    },
    browser: {
        name: string,
        mobile: {
            userAgent: string,
            screenHeight: number,
            screenWidth: number,
            viewportHeight: number,
            viewportWidth: number,
        },
        desktop: {
            userAgent: string,
            screenHeight: number,
            screenWidth: number,
            viewportHeight: number,
            viewportWidth: number,
        }
    },
    actions: {
        isSelected: boolean,
        [key: string]: unknown,
    }
}

const initUserState: UserInterface = {
    info: {
        id: "",
        username: "",
        uid: "",
        password: "",
        twoFA: "",
        email: "",
        emailPassword: "",
        phoneNumber: "",
        birthDay: "",
        gender: "",
        avatar: "",
        group: "",
        type: "",
        note: "",
        status: "",
        createdAt: "",
        updatedAt: "",
    },
    browser: {
        name: "",
        mobile: {
            userAgent: "",
            screenHeight: 0,
            screenWidth: 0,
            viewportHeight: 0,
            viewportWidth: 0
        },
        desktop: {
            userAgent: "",
            screenHeight: 0,
            screenWidth: 0,
            viewportHeight: 0,
            viewportWidth: 0
        }
    },
    actions: {
        isSelected: false,
    },
}

export interface SettingInterface {
    isMobile: boolean,
    proxy: string[],
    process: number,
    [key: string]: unknown,
}

const initSettingState: SettingInterface = {
    isMobile: false,
    proxy: [""],
    process: 1
};


export {
    initLikeAndCommentState,
    initBotState,
    initUserState,
    initSettingState,
}