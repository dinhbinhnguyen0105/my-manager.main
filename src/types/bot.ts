// _bot.tsx


// type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry";

interface BaseInterface {
    isSelected: boolean;
    value: number | string;
}

interface InteractionInterface {
    isSelected: boolean;
    value: number | string;
    like: BaseInterface;
    comment: BaseInterface;
}

interface FriendInterface extends InteractionInterface {
    poke: BaseInterface;
    pokeBack: BaseInterface;
}

interface PageInterface extends InteractionInterface {
    invite: BaseInterface;
    url: string;
};

export type LikeCommentType = {
    newsFeed: InteractionInterface;
    group: InteractionInterface;
    watch: InteractionInterface;
    friend: FriendInterface;
    page: PageInterface;
    marketplace: boolean;
    notification: boolean;
    search: boolean;
    comments: string;
    reactions: string;
}

const initLikeCommentState: LikeCommentType = {
    newsFeed: {
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
    watch: {
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
        pokeBack: { isSelected: false, value: 0 },
    },
    page: {
        isSelected: false,
        value: 0,
        url: "",
        like: { isSelected: false, value: 0 },
        comment: { isSelected: false, value: 0 },
        invite: { isSelected: false, value: 0 },
    },
    marketplace: false,
    notification: false,
    search: false,
    comments: "",
    reactions: "",
}

export interface BotInterface {
    likeComment: LikeCommentType;
}

const initBotState: BotInterface = {
    likeComment: initLikeCommentState
};

export type BotActionType = {
    type: string;
    likeComment?: LikeCommentType;
    path?: string;
    value?: number | string | boolean;
}

export {
    initLikeCommentState,
    initBotState,
};