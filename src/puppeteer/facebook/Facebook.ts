import path from "path";
import Puppeteer from "../Puppeteer";
import { PuppeteerControllerConfigInterface } from "~/types/puppeteer";
import { ElementHandle } from "puppeteer";
// import { Element } from "domhandler";

class Facebook extends Puppeteer {
    language: "vi" | "en";
    selectors: {
        watch_feed__id: string;
        container__main: string;
        dialog: string;
        dialog__anonymous: string;
        article__feed: string;
        article__video: string;
        button: string;
        button__ellipsis: string;
        textbox: string;
    };
    ariaLabels: {
        vi: {
            container__feeds: string;
            btn__close: string;
            btn__like: string;
            btn__comment: string;
            btn__submitComment: string;
            btn__timeline: string;
            btn__profile: string;
            btn__poke: string;
            btn__pokeBack: string;
            btn__videoPlay: string;
            btn__videoPause: string;
            btn__profileSetting: string;
            btn__invite: string;
            dialog__reactions: string;
            dialog__leavePage: string;
            dialog__createListing: string;
            dialog__videoViewer: string;
            dialog__inviteFriend: string;
            dialog__leavePage__btn__leave: string;
            dialog__createListing__btn__next: string;
            dialog__createListing__btn__post: string;
        };
        en: {
            container__feeds: string;
            btn__close: string;
            btn__like: string;
            btn__comment: string;
            btn__submitComment: string;
            btn__timeline: string;
            btn__profile: string;
            btn__poke: string;
            btn__pokeBack: string;
            btn__videoPlay: string;
            btn__videoPause: string;
            btn__profileSetting: string;
            btn__invite: string;
            dialog__reactions: string;
            dialog__leavePage: string;
            dialog__createListing: string;
            dialog__videoViewer: string;
            dialog__inviteFriend: string;
            dialog__leavePage__btn__leave: string;
            dialog__createListing__btn__next: string;
            dialog__createListing__btn__post: string;
        };
    }
    constructor(options: PuppeteerControllerConfigInterface) {
        super(options);
        this.language = "vi";
        this.selectors = {
            watch_feed__id: "#watch_feed",

            container__main: "div[role='main']",
            dialog: "div[role='dialog']",
            dialog__anonymous: 'div[aria-labelledby][role="dialog"]',
            article__feed: "div[aria-describedby]",
            article__video: "div[data-virtualized]",

            button: "div[role='button']",
            button__ellipsis: "div[aria-expanded='false'][role='button']",
            textbox: "div[role='textbox']",
        }
        this.ariaLabels = {
            vi: {
                container__feeds: "bảng feed",

                btn__close: "đóng",
                btn__like: "thích",
                btn__comment: "viết bình luận",
                btn__submitComment: "bình luận",
                btn__timeline: "dòng thời gian",
                btn__profile: "trang cá nhân",
                btn__poke: "chọc",
                btn__pokeBack: "chọc lại",
                btn__videoPlay: "phát",
                btn__videoPause: "tạm dừng",
                btn__profileSetting: "xem thêm tùy chọn trong phần cài đặt trang cá nhân",
                btn__invite: "gửi lời mời",

                dialog__reactions: "cảm xúc",
                dialog__leavePage: "rời khỏi trang?",
                dialog__createListing: "tạo bài niêm yết mới",
                dialog__videoViewer: "trình xem video",
                dialog__inviteFriend: "mời bạn bè",

                dialog__leavePage__btn__leave: "rời khỏi trang",
                dialog__createListing__btn__next: "tiếp",
                dialog__createListing__btn__post: "đăng",

            },
            en: {
                container__feeds: "feeds",

                btn__close: "close",
                btn__like: "like",
                btn__comment: "leave a comment",
                btn__submitComment: "comment",
                btn__timeline: "timeline",
                btn__profile: "profile",
                btn__poke: "poke",
                btn__pokeBack: "poke back",
                btn__videoPlay: "play",
                btn__videoPause: "pause",
                btn__profileSetting: "profile settings see more options",
                btn__invite: "send invites",

                dialog__reactions: "reactions",
                dialog__leavePage: "leave page?",
                dialog__createListing: "create new listing",
                dialog__videoViewer: "video viewer",
                dialog__inviteFriend: "invite friends",

                dialog__leavePage__btn__leave: "leave page",
                dialog__createListing__btn__next: "next",
                dialog__createListing__btn__post: "post",
            }
        }
    }

    async initConstants() {
        try {

        } catch (error) {

        };
    }

    async checkLogin() {
        try {
            if (!this.page) { return false; }
            const uid = path.basename(this.mainConfig.userDataDir);
            const loginUrl = "https://www.facebook.com/login";
            await this.page.goto(loginUrl);
            await new Promise(resolve => setTimeout(resolve, 1000));
            const currentUrl = await this.page.url();
            if (currentUrl.includes("home.php")) {
                return true;
            } else {
                console.error(`User is not logged into Facebook in userDataDir: [${uid}]`)
                return false;
            };
        } catch (error) {
            console.error("ERROR [checkLogin]", error);
            await this.cleanup();
            return false;
        };
    };

    async closeAnonymousDialog(): Promise<boolean> {
        try {
            if (!this.page) { return false; };
            for (let i = 0; i < 5; i++) {
                const anonymousDialog = await this.page.$(this.selectors.dialog__anonymous);
                if (anonymousDialog) {
                    const button = await this.getButtonWithAriaLabel(anonymousDialog, this.ariaLabels[this.language].btn__close);
                    if (button) {
                        button.click();
                        return true;
                    } else { return false; };
                } else {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    continue;
                };
            };
            return false;
        } catch (error) {
            console.log("ERROR: ", error);
            return false;
        }
    };

    async confirmLeavePage(): Promise<boolean> {
        try {
            if (!this.page) { return false; };
            for (let i = 0; i < 5; i++) {
                const dialogElms = await this.page.$$(this.selectors.dialog);
                for (let dialogElm of dialogElms) {
                    const dialogName = await dialogElm.evaluate((elm: Element) => elm.getAttribute("aria-label"));
                    if (dialogName && (dialogName.trim().toLowerCase() === this.ariaLabels[this.language].dialog__leavePage.trim().toLowerCase())) {
                        const button = await this.getButtonWithAriaLabel(dialogElm, this.ariaLabels[this.language].dialog__leavePage__btn__leave);
                        if (button) {
                            this.delay();
                            await button.click();
                            return true;
                        } else { continue; };
                    } else { continue; };
                };
                await this.delay(1000, 1000);
            };
            return false;
        } catch (error) {
            console.error("ERROR: ", error);
            return false;
        }
    };

    async handleReact(article: ElementHandle, reaction: string): Promise<boolean> {
        try {
            if (article) {
                const reactions = ["like", "love", "care", "haha", "wow", "sad", "angry",];
                const likeButtonElm = await this.getButtonWithAriaLabel(article, this.ariaLabels[this.language].btn__like);
                if (likeButtonElm) {
                    await this.scrollToElement(likeButtonElm);
                    await this.delay(500, 1000);
                    await likeButtonElm.hover();
                    const reactionsDialogElm = await this.getDialogWithAriaLabel(this.ariaLabels[this.language].dialog__reactions);
                    const reactionIndex = reactions.findIndex(r => r.trim().toLowerCase() === reaction.trim().toLowerCase());
                    if (reactionIndex >= 0 && reactionsDialogElm) {
                        // const buttonElm = await this.getButtonWithAriaLabel(reactionsDialogElm, )
                        const buttonElms = await reactionsDialogElm?.$$(this.selectors.button);
                        await this.delay(1000, 3000);
                        await buttonElms[reactionIndex].click();
                        await this.delay(1000, 3000);
                        return true;
                    };
                };
            };
            return false;
        } catch (error) {
            console.error(error);
            return false;
        };
    };

    async handleComment(article: ElementHandle, comment: string): Promise<boolean> {
        try {
            if (article) {
                const commentBtnElm = await this.getButtonWithAriaLabel(article, this.ariaLabels[this.language].btn__comment);
                if (commentBtnElm) {
                    await this.scrollToElement(commentBtnElm);
                    await this.delay();
                    await commentBtnElm.click();
                    await this.delay();
                    if (await this.closeAnonymousDialog()) { return false; };
                    const textboxElm = await article.waitForSelector(this.selectors.textbox);
                    if (textboxElm) {
                        await this.delay();
                        textboxElm?.focus();
                        await this.delay();
                        await textboxElm.type(comment);
                        const submitCommentBtnElm = await this.getButtonWithAriaLabel(article, this.ariaLabels[this.language].btn__submitComment);
                        if (submitCommentBtnElm) {
                            await this.delay();
                            await submitCommentBtnElm.click();
                            return true;
                        };
                    };
                };
            };
            return false;
        } catch (error) {
            console.error("ERROR: ", error);
            return false;
        };
    };

    async handleInteractFeeds(url: string, reactions: string[], comments: string[], duration: number = 150_000): Promise<boolean> {
        try {
            if (!this.page) { return false; };
            await this.page.goto(url);
            const mainContainerElm = await this.page.waitForSelector(this.selectors.container__main, { timeout: 60_000 });
            const startTime = Date.now();
            let count = 0;
            while (Date.now() - startTime < duration) {
                if (mainContainerElm) {
                    await mainContainerElm.waitForSelector(this.selectors.article__feed);
                    const articleElms = await mainContainerElm.$$(this.selectors.article__feed);
                    if (count < articleElms.length) {
                        await this.scrollToElement(articleElms[count]);
                        await this.delay(1000, 3000);
                        if (Math.random() < 0.2) {
                            if (reactions.length > 0) {
                                const isLiked = await this.handleReact(articleElms[count], reactions[reactions.length - 1]);
                                isLiked && reactions.pop();
                            };
                            if (comments.length > 0) {
                                const isComments = await this.handleComment(articleElms[count], reactions[comments.length - 1]);
                                isComments && comments.pop();
                            };
                        }
                        count++;
                    };
                } else { return false; }
            }
            return true;
        } catch (error) {
            console.error("ERROR: ", error);
            return false;
        };
    };

    async getButtonWithAriaLabel(containerElm: ElementHandle, ariaLabel: string): Promise<ElementHandle | null> {
        try {
            if (!containerElm) { return null; }
            await containerElm.waitForSelector(this.selectors.button);
            const buttonElms = await containerElm.$$(this.selectors.button);
            for (let buttonElm of buttonElms) {
                const btnName = await buttonElm.evaluate((elm: Element): string | null => elm.getAttribute("aria-label"));
                const isDisabled = await buttonElm.evaluate((elm: Element): string | null => elm.getAttribute("aria-disabled"));
                if (btnName && (btnName.trim().toLowerCase() === ariaLabel.trim().toLowerCase()) && !isDisabled) {
                    return buttonElm;
                } else { continue; };
            };
            return null;
        } catch (error) {
            console.error("ERROR: ", error);
            return null;
        };
    };

    async getDialogWithAriaLabel(ariaLabel: string): Promise<ElementHandle | null> {
        try {
            if (!this.page) { return null; };
            for (let i = 0; i < 30; i++) {
                const dialogElms = await this.page.$$(this.selectors.dialog);
                for (let dialogElm of dialogElms) {
                    const dialogName = await dialogElm.evaluate((elm: Element): string | null => elm.getAttribute("aria-label"));
                    if (dialogName && (dialogName.trim().toLowerCase() === ariaLabel.trim().toLowerCase())) {
                        return dialogElm;
                    } else { continue; };
                };
                await this.delay(1000, 1000);
            }
            return null;
        } catch (error) {
            console.error("ERROR: ", error);
            return null;
        }
    }
}

export default Facebook;
