import { Queue } from "bullmq";
import { redisQueue } from "./redis-queue";

export const passwordResetEmailQueue = new Queue("password_reset_email_queue", {
  connection: redisQueue,
  defaultJobOptions: {
    attempts: 1,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
