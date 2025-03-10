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

export interface LikeCommentInterface {
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
    likeAndComment: LikeCommentInterface,
}

const initLikeAndCommentState: LikeCommentInterface = {
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

export { initBotState, initLikeAndCommentState };