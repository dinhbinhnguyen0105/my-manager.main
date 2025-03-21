import process from "process";
import { PuppeteerControllerConfigInterface } from "~/types/puppeteer";
import Facebook from "./Facebook";
import { LikeCommentType } from "~/types/bot";

class LikeComment extends Facebook {
    likeComment: LikeCommentType;
    reactions: string[];
    comments: string[];
    constructor(configs: PuppeteerControllerConfigInterface, likeComment: LikeCommentType) {
        super(configs);
        this.likeComment = likeComment;
        this.reactions = likeComment.reactions.split("|");
        this.reactions = this.reactions.map(reaction => reaction.trim().toLowerCase());
        this.comments = likeComment.comments.split("|");
        this.comments = this.comments.map(comment => comment.trim());
    }

    static async run(configs: PuppeteerControllerConfigInterface, likeComment: LikeCommentType) {
        const controller = new LikeComment(configs, likeComment);
        try {
            await controller.initBrowser();
            if (!await controller.checkLogin()) return false;
            // const pageLanguage = await controller.evaluate(() => document.documentElement.lang);
            const language = await controller.page?.evaluate(() => document.documentElement.lang);
            if (language?.trim().toLocaleLowerCase() === "vi") {
                controller.language = "vi";
            } else {
                controller.language = "en";
            }
            if (likeComment.newsFeed.isSelected) {
                await controller.handleNewsFeed();
            }
            console.log("Finished");
            return true;
        } catch (error) {
            console.error(error);
            return false;
        } finally {
            await controller.cleanup();
        }
    }

    async handleFriend() {

    };

    async handleNewsFeed(): Promise<boolean> {
        try {
            console.log("Handle news feed");
            const duration = typeof this.likeComment.newsFeed.value === "string" ? parseInt(this.likeComment.newsFeed.value) : this.likeComment.newsFeed.value;
            const likeValue = typeof this.likeComment.newsFeed.like.value === "string" ? 0 : this.likeComment.newsFeed.like.value;
            const commentValue = typeof this.likeComment.newsFeed.comment.value === "string" ? 0 : this.likeComment.newsFeed.comment.value;
            // const reactions = this.reactions.slice(0,  parseInt(this.likeComment.newsFeed.like.value))
            const isFeed = await this.handleInteractFeeds(
                "https://www.facebook.com/?filter=all&sk=h_chr",
                this.likeComment.newsFeed.like.isSelected ? this.reactions.slice(0, likeValue) : [],
                this.likeComment.newsFeed.comment.isSelected ? this.comments.slice(0, commentValue) : [],
                duration,
            );
            if (isFeed) { return true; }
            else { return false; };
        } catch (error) {
            console.error(error);
            return false;
        };
    };
};

if (require.main === module) {
    process.on('message', async (msg: {
        task: PuppeteerControllerConfigInterface,
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