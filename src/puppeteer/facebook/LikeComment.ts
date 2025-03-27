import process from "process";
import { ConfigInterface } from "~/types/puppeteer";
import Facebook from "./Facebook";
import { LikeCommentType } from "~/types/bot";
import { ElementHandle } from "puppeteer";

class LikeComment extends Facebook {
    likeComment: LikeCommentType;
    reactions: string[];
    comments: string[];
    constructor(configs: ConfigInterface, likeComment: LikeCommentType) {
        super(configs);
        this.likeComment = likeComment;
        this.reactions = likeComment.reactions.split("|");
        this.reactions = this.reactions.map(reaction => reaction.trim().toLowerCase());
        this.comments = likeComment.comments.split("|");
        this.comments = this.comments.map(comment => comment.trim());
    }

    static async run(configs: ConfigInterface, likeComment: LikeCommentType) {
        const controller = new LikeComment(configs, likeComment);
        try {
            await controller.initBrowser();
            if (!await controller.checkLogin()) return false;
            const language = await controller.page?.evaluate(() => document.documentElement.lang);
            if (language?.trim().toLocaleLowerCase() === "vi") { controller.language = "vi"; }
            else { controller.language = "en"; };

            if (likeComment.newsFeed.isSelected) { await controller.handleNewsFeed(); };
            if (likeComment.watch.isSelected) { await controller.handleWatch(); };
            if (likeComment.group.isSelected) { await controller.handleGroup(); };
            if (likeComment.friend.isSelected) { await controller.handleFriend(); };

            console.log("Finished");
            return true;
        } catch (error) {
            console.error(error);
            // return false;
        } finally {
            await controller.cleanup();
            return true;
        }
    }

    async handleFriend(): Promise<boolean> {
        const handlePoke = async ({ num, isPokeBack = false }: { num: number, isPokeBack: boolean }): Promise<boolean> => {
            try {
                if (!this.page) { return false; }
                await this.page.goto("https://www.facebook.com/pokes");
                for (let i = 0; i < 3; i++) {
                    const loadingStateElm = await this.page.$(this.selectors.loading_state);
                    if (loadingStateElm) {
                        await this.scrollToElement(loadingStateElm);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    } else { break; };
                };
                await this.delay();
                let btnElms = await this.getButtonsWithAriaLabel(this.page, isPokeBack ? this.ariaLabels[this.language].btn__pokeBack : this.ariaLabels[this.language].btn__poke);
                if (btnElms.length < 1) { return true; };
                let _num = btnElms.length < num ? 1 : num;

                while (_num > 0) {
                    btnElms = await this.getButtonsWithAriaLabel(this.page, isPokeBack ? this.ariaLabels[this.language].btn__pokeBack : this.ariaLabels[this.language].btn__poke);
                    const index = Math.floor(Math.random() * (btnElms.length));
                    if (Math.random() > .5) {
                        await this.delay();
                        await this.scrollToElement(btnElms[index]);
                        await this.delay();
                        if (Math.random() > .2) {
                            await this.delay();
                            await btnElms[index].hover();
                            await this.delay();
                            await btnElms[index].click();
                            _num--;
                        };
                    };
                };
                return true;
            } catch (error) {
                console.error("ERROR [handleFriend > handlePoke]: ", error);
                return false;
            }
        }

        try {
            console.log("Handle friend");

            const friendInfo = this.likeComment.friend;
            const duration = typeof friendInfo.value === "string" ? 0 : friendInfo.value;
            const reactionsNum = typeof friendInfo.like.value === "string" ? 0 : friendInfo.like.value;
            const commentsNum = typeof friendInfo.comment.value === "string" ? 0 : friendInfo.comment.value;
            const pokeNum = typeof friendInfo.poke.value === "string" ? 0 : friendInfo.poke.value
            const pokeBackNum = typeof friendInfo.pokeBack.value === "string" ? 0 : friendInfo.pokeBack.value

            const isFeeds = await this.handleInteractFeeds(
                "https://www.facebook.com/?filter=friends&sk=h_chr",
                friendInfo.like.isSelected ? this.reactions.splice(0, reactionsNum) : [],
                friendInfo.comment.isSelected ? this.comments.splice(0, commentsNum) : [],
                duration,
            );
            if (friendInfo.poke.isSelected && pokeNum) {
                await handlePoke({ num: pokeNum, isPokeBack: false });
            };
            if (friendInfo.pokeBack.isSelected && pokeBackNum) {
                await handlePoke({ num: pokeBackNum, isPokeBack: true });
            };

            return true;
        } catch (error) {
            console.error("ERROR [handleFriend]: ", error);
            return false;
        }
    };

    async handleNewsFeed(): Promise<boolean> {
        try {
            console.log("Handle news feed");
            const duration = typeof this.likeComment.newsFeed.value === "string" ? parseInt(this.likeComment.newsFeed.value) : this.likeComment.newsFeed.value;
            const likeValue = typeof this.likeComment.newsFeed.like.value === "string" ? 0 : this.likeComment.newsFeed.like.value;
            const commentValue = typeof this.likeComment.newsFeed.comment.value === "string" ? 0 : this.likeComment.newsFeed.comment.value;
            const isFeed = await this.handleInteractFeeds(
                "https://www.facebook.com/?filter=all&sk=h_chr",
                this.likeComment.newsFeed.like.isSelected ? this.reactions.splice(0, likeValue) : [],
                this.likeComment.newsFeed.comment.isSelected ? this.comments.splice(0, commentValue) : [],
                duration,
            );
            if (isFeed) { return true; }
            else { return false; };
        } catch (error) {
            console.error(error);
            return false;
        };
    };

    async handleGroup(): Promise<boolean> {
        try {
            console.log("Handle group");
            const groupInfo = this.likeComment.group;
            const duration = typeof groupInfo.value === "string" ? 0 : groupInfo.value;
            const reactionsNum = typeof groupInfo.like.value === "string" ? 0 : groupInfo.like.value;
            const commentsNum = typeof groupInfo.comment.value === "string" ? 0 : groupInfo.comment.value;
            const isFeed = await this.handleInteractFeeds(
                "https://www.facebook.com/?filter=groups&sk=h_chr",
                groupInfo.like.isSelected ? this.reactions.splice(0, reactionsNum) : [],
                groupInfo.comment.isSelected ? this.comments.splice(0, commentsNum) : [],
                duration,
            );
            if (!isFeed) { return false; };
            return true;
        } catch (error) {
            console.error("ERROR [handleGroup]", error);
            return false;
        };
    };

    async handleWatch(): Promise<boolean> {
        const generateRandomDelays = ({ duration, min = 1, max = 3 }: { duration: number, min: number, max: number }): { numDelays: number, delays: number[] } => {
            const numDelays = Math.floor(Math.random() * (max - min + 1)) + min; // Đảo ngược min và max
            const delays: number[] = [];
            let remainingTime = duration;
            const minDelay = 1000; // 1 giây

            for (let i = 0; i < numDelays; i++) {
                let delay;
                if (i === numDelays - 1) {
                    delay = remainingTime;
                } else {
                    delay = Math.floor(Math.random() * (remainingTime - (numDelays - i - 1) * minDelay)) + minDelay;
                }
                delays.push(delay);
                remainingTime -= delay;
            }

            return {
                numDelays: numDelays,
                delays: delays
            };
        };

        const watch = async (articleElm: ElementHandle): Promise<boolean> => {
            try {
                await this.delay();
                await this.scrollToElement(articleElm);
                await this.delay();
                const videoPlayerElm = await articleElm.waitForSelector(this.selectors.video_player);
                if (!videoPlayerElm) { return false; };
                await this.scrollToElement(videoPlayerElm);
                await this.delay();
                await videoPlayerElm.hover();
                await this.delay(1000, 3000);
                await articleElm.waitForSelector(this.selectors.button);
                const button = await this.getButtonWithAriaLabel(articleElm, this.ariaLabels[this.language].btn__videoPlay);
                await button?.click();

                return false;
            } catch (error) {
                console.error("ERROR [handleWatch > watch] : ", error);
                return false;
            }
        };

        try {
            if (!this.page) { return false; }
            console.log("Handle watch");
            await this.page.goto("https://www.facebook.com/watch/");
            await this.page.waitForSelector(this.selectors.watch_feed__id);
            const watchFeedElm = await this.page.$(this.selectors.watch_feed__id);

            const duration = typeof this.likeComment.watch.value === "number" ? this.likeComment.watch.value : 0;

            const { delays, } = generateRandomDelays({ duration: duration, min: 2, max: 4 });

            const commentNum = typeof this.likeComment.watch.comment.value === "number" ? this.likeComment.watch.comment.value : 0;
            const comments = this.comments.splice(0, commentNum);
            const reactsNum = typeof this.likeComment.watch.like.value === "number" ? this.likeComment.watch.like.value : 0;
            const reacts = this.reactions.splice(0, reactsNum);
            for (let delay of delays) {
                await watchFeedElm?.waitForSelector(this.selectors.article__video);
                const videoArticleElms = await watchFeedElm?.$$(this.selectors.article__video);
                if (!videoArticleElms) { return false; };
                const videoIndex = Math.floor(Math.random() * (videoArticleElms.length - 1));
                await watch(videoArticleElms[videoIndex]);
                await new Promise(resolve => setTimeout(resolve, delay));
                if (Math.random() < .5) {
                    if (this.likeComment.watch.like.isSelected && reacts[0]) {
                        const isReact = await this.handleReact(videoArticleElms[videoIndex], reacts[0]);
                        if (isReact) reacts.shift();
                    };
                    await this.delay(2000, 3000);
                    if (this.likeComment.watch.comment.isSelected && comments.length > 0) {
                        const isComment = await this.handleComment(videoArticleElms[videoIndex], comments[0]);
                        if (isComment) comments.shift();
                        // await this.closeAnonymousDialog();
                        await this.delay();
                    };
                };
            };
            return true;
        } catch (error) {
            console.error(error);
            return false;
        };
    };

    async handlePage(): Promise<boolean> {
        try {
            if (!this.page) { return false; };
            const pageInfo = this.likeComment.page;
            const pageUrl = pageInfo.url;
            const duration = typeof pageInfo.value === "string" ? 0 : pageInfo.value;
            const reactionsNum = typeof pageInfo.like.value === "string" ? 0 : pageInfo.like.value;
            const commentsNum = typeof pageInfo.comment.value === "string" ? 0 : pageInfo.comment.value;

            const mainElm = await this.page.waitForSelector(this.selectors.container__main);
            if (!mainElm) { return false; };
            await this.handleInteractFeeds(
                pageUrl,
                pageInfo.like.isSelected ? this.reactions.splice(0, reactionsNum) : [],
                pageInfo.comment.isSelected ? this.comments.splice(0, commentsNum) : [],
                duration,
            )

            await this.delay();
            const ellipsisBtnElm = await this.getButtonWithAriaLabel(mainElm, this.ariaLabels[this.language].btn__profileSetting);
            if (!ellipsisBtnElm) { return false; };
            await this.delay();
            await this.scrollToElement(ellipsisBtnElm);
            await this.delay();
            await ellipsisBtnElm.click();
            await this.delay();

            await this.page.waitForSelector(this.selectors.popup__menu);
            const menuElm = await this.page.$(this.selectors.popup__menu);
            if (!menuElm) { return false; };
            await this.page.waitForSelector(this.selectors.popup__menu__item);
            const menuItemElms = await menuElm.$$(this.selectors.popup__menu__item);

            for (let menuItemElm of menuItemElms) {
                const textContent = await menuItemElm.evaluate(elm => elm.textContent);
                if (!textContent) { continue; };
                if (textContent.trim().toLowerCase().includes(this.textContents[this.language].inviteFriend)) {
                    await menuItemElm.click();
                    await this.delay();
                    await this.page.waitForSelector(this.selectors.dialog);
                    const dialogs = await this.page.$$(this.selectors.dialog);
                    for (let dialog of dialogs) {
                        const dialogName = await dialog.evaluate(elm => elm.getAttribute("aria-label"));
                        if (!dialogName) { continue; };
                        if (dialogName.trim().toLowerCase() === this.ariaLabels[this.language].dialog__inviteFriend) {
                            for (let i = 0; i < 3; i++) {
                                try {
                                    const loadingState = await dialog.$(this.selectors.loading_state);
                                    if (!loadingState) { break; };
                                    await this.scrollToElement(loadingState);
                                    await new Promise(resolve => setTimeout(resolve, 2000));
                                } catch (error) { continue; };
                            };
                            await dialog.waitForSelector(this.selectors.checkbox_false);
                            const checkboxList = await dialog.$$(this.selectors.checkbox_false);
                            for (let i = 0; i < 3; i++) {
                                const randomIndex = Math.floor(Math.random() * checkboxList.length);
                                await this.delay();
                                await this.scrollToElement(checkboxList[randomIndex]);
                                await this.delay();
                                await checkboxList[randomIndex].click();
                                await this.delay();
                            };
                            await this.delay();
                            await dialog.waitForSelector(this.selectors.button);
                            const buttons = await dialog.$$(this.selectors.button);
                            for (let button of buttons) {
                                const buttonName = await button.evaluate(elm => elm.getAttribute("aria-label"));
                                if (!buttonName) { continue; };
                                if (buttonName.trim().toLowerCase() === this.ariaLabels[this.language].btn__invite) {
                                    await button.click();
                                    console.log("[handlePageInteract] invited")
                                    return true;
                                };
                            };
                        };
                    };
                };
            };

            return true;
        } catch (error) {
            console.error("ERROR [handlePage]: ", error);
            return false;
        }
    }
};

if (require.main === module) {
    process.on('message', async (msg: {
        task: ConfigInterface,
        likeComment: LikeCommentType
    }) => {
        try {
            const result = await LikeComment.run(msg.task, msg.likeComment);
            process.send?.({ success: result });
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
                process.send?.({ error: error.message });
            } else {
                process.send?.({ error: "An unknown error occurred." });
            }
        } finally {
            process.exit(0);
        }
    });
}

export default LikeComment;