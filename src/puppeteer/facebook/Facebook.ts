import path from "path";
import Puppeteer from "../Puppeteer";
import { ConfigInterface } from "~/types/puppeteer";
import { ElementHandle, Page } from "puppeteer";
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
        button__expand: string;
        textbox: string;
        video_player: string;
        loading_state: string;
        popup__menu: string;
        popup__menu__item: string;

        checkbox_false: string;
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
    };
    textContents: {
        vi: {
            inviteFriend: string;
        };
        en: {
            inviteFriend: string;
        };
    };
    constructor(options: ConfigInterface) {
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
            button__expand: "div[aria-expanded='false'][role='button']",

            textbox: "div[role='textbox']",

            video_player: "div[role='presentation']",
            loading_state: "div[data-visualcompletion='loading-state']",

            popup__menu: "div[role='menu']",
            popup__menu__item: "div[role='menuitem']",
            checkbox_false: "div[role='checkbox'][aria-checked='false']",
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
                dialog__inviteFriend: "mời bạn bè",

                dialog__leavePage__btn__leave: "rời khỏi trang",
                dialog__createListing__btn__next: "tiếp",
                dialog__createListing__btn__post: "đăng",

                dialog__videoViewer: "trình xem video",
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
                dialog__inviteFriend: "invite friends",

                dialog__leavePage__btn__leave: "leave page",
                dialog__createListing__btn__next: "next",
                dialog__createListing__btn__post: "post",

                dialog__videoViewer: "video viewer",
            }
        };
        this.textContents = {
            vi: {
                inviteFriend: "mời bạn bè",
            },
            en: {
                inviteFriend: "invite friends",
            },
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

    async closeDialog(dialogElm: ElementHandle): Promise<boolean> {
        try {
            if (!dialogElm) { return false; };
            for (let i = 0; i < 5; i++) {
                if (dialogElm) {
                    const button = await this.getButtonWithAriaLabel(dialogElm, this.ariaLabels[this.language].btn__close);
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
            console.log("ERROR [closeDialog]: ", error);
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
                console.log({ reaction });
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
        // const comment
        try {
            if (article) {
                const commentBtnElm = await this.getButtonWithAriaLabel(article, this.ariaLabels[this.language].btn__comment);
                if (commentBtnElm) {
                    await this.scrollToElement(commentBtnElm);
                    await this.delay();
                    await commentBtnElm.click();
                    await this.delay();
                    try {
                        const textboxElm = await article.waitForSelector(this.selectors.textbox, { timeout: 15_000 });
                        textboxElm?.focus();
                        await this.delay();
                        await textboxElm?.type(comment);
                        await this.delay();
                        const submitBtnElm = await this.getButtonWithAriaLabel(article, this.ariaLabels[this.language].btn__submitComment);
                        submitBtnElm?.click();
                        await this.delay(2000, 3000);
                    } catch {
                        let dialogElm = await this.page?.$(this.selectors.dialog__anonymous);
                        if (!dialogElm) {
                            dialogElm = await this.getDialogWithAriaLabel(this.ariaLabels[this.language].dialog__videoViewer);
                        };
                        if (dialogElm) {
                            const _commentBtnElm = await this.getButtonWithAriaLabel(dialogElm, this.ariaLabels[this.language].btn__comment);
                            await this.delay();
                            await _commentBtnElm?.click();
                            const textboxElm = await dialogElm.waitForSelector(this.selectors.textbox, { timeout: 15_000 });
                            textboxElm?.focus();
                            await this.delay();
                            await textboxElm?.type(comment);
                            await this.delay();
                            const submitBtnElm = await this.getButtonWithAriaLabel(dialogElm, this.ariaLabels[this.language].btn__submitComment);
                            submitBtnElm?.click();
                            await this.delay(2000, 3000);

                            await this.closeDialog(dialogElm);
                            await this.delay();
                        };
                    };
                    return true;
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
            // let count = 0;
            let articleCount = 0;
            let currentArticle = 0;
            while (Date.now() - startTime < duration) {
                if (mainContainerElm) {
                    await mainContainerElm.waitForSelector(this.selectors.article__feed);
                    let articleElms = await mainContainerElm.$$(this.selectors.article__feed);
                    for (let articleElm of articleElms) {
                        const articleAttr = await articleElm.evaluate(elm => elm.getAttribute("data-article"));
                        if (!articleAttr) {
                            await articleElm.evaluate((elm, articleCount) => elm.setAttribute("data-article", articleCount.toString()), articleCount);
                            articleCount++;
                        };
                    };

                    const articleElm = await mainContainerElm.$(`div[data-article="${currentArticle}"]`);
                    if (articleElm) {
                        await this.scrollToElement(articleElm);
                        await this.delay(1000, 3000);
                        currentArticle++;
                        if (Math.random() < 0.2) {
                            if (reactions.length > 0) {
                                const isLiked = await this.handleReact(articleElm, reactions[reactions.length - 1]);
                                isLiked && reactions.pop();
                            };
                            if (comments.length > 0) {
                                const isComments = await this.handleComment(articleElm, comments[comments.length - 1]);
                                isComments && comments.pop();
                            };
                        }
                    }
                    else { return false; };
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

    async getButtonsWithAriaLabel(containerElm: ElementHandle | Page, ariaLabel: string): Promise<ElementHandle[] | []> {
        try {
            if (!containerElm) { return []; }
            await containerElm.waitForSelector(this.selectors.button);
            const buttonElms = await containerElm.$$(this.selectors.button);
            const buttonResults = [];
            for (let buttonElm of buttonElms) {
                const btnName = await buttonElm.evaluate((elm: Element): string | null => elm.getAttribute("aria-label"));
                const isDisabled = await buttonElm.evaluate((elm: Element): string | null => elm.getAttribute("aria-disabled"));
                if (btnName && (btnName.trim().toLowerCase() === ariaLabel.trim().toLowerCase()) && !isDisabled) {
                    buttonResults.push(buttonElm);
                } else { continue; };
            };
            return buttonResults;
        } catch (error) {
            console.error("ERROR: ", error);
            return [];
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
