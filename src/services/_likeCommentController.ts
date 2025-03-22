import { fork } from "child_process";
import path, { resolve } from "path";
import { LikeCommentType } from "~/types/bot";
import { ConfigInterface } from "~/types/puppeteer";

const likeCommentController = async ({ tasks, likeComment, concurrency = 3 }: {
    tasks: ConfigInterface[],
    likeComment: LikeCommentType,
    concurrency?: number,
}) => {
    const results = [];
    const queue = [...tasks];

    const workers = Array.from({ length: concurrency }, () => {
        fork(path.resolve(__dirname, '../puppeteer/facebook/LikeComment.js'));
    });

    const handleMessage = (workers: any) => (msg: any) => {
        if (msg.error) { console.error("Error from worker: ", msg.error); }
        else { results.push(msg.success); };

        if (queue.length > 0) {
            workers.send({
                task: queue.shift(),
                likeComment,
            });
        } else { workers.kill(); };
    };

    await Promise.all(workers.map(worker => {
        return new Promise(resolve => {
            worker.on("message", handleMessage(worker));
        })
    }))
}