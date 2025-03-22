// /src/services/likeCommentController.ts
import { fork } from "child_process";
import path from "path";
import { LikeCommentType } from "~/types/bot";
import { ConfigInterface } from "~/types/puppeteer";

const likeCommentController = async ({
    tasks,
    likeComment,
    concurrency = 3
}: {
    tasks: ConfigInterface[],
    likeComment: LikeCommentType,
    concurrency?: number
}) => {
    const results: any[] = [];
    const queue = [...tasks];

    // Tạo worker pool
    const workers = Array.from({ length: concurrency }, () =>
        fork(path.resolve(__dirname, '../puppeteer/facebook/LikeComment.js'))
    );

    // Xử lý kết quả từ worker
    const handleMessage = (worker: any) => (msg: any) => {
        if (msg.error) {
            console.error('Lỗi từ worker:', msg.error);
        } else {
            results.push(msg.success);
        }

        // Gửi task tiếp theo
        if (queue.length > 0) {
            worker.send({
                task: queue.shift(),
                likeComment
            });
        } else {
            worker.kill();
        }
    };

    // Khởi tạo các worker
    await Promise.all(workers.map(worker => {
        return new Promise((resolve) => {
            worker.on('message', handleMessage(worker));
            worker.on('exit', resolve);

            if (queue.length > 0) {
                worker.send({
                    task: queue.shift(),
                    likeComment
                });
            }
        });
    }));

    return results;
};

export default likeCommentController;