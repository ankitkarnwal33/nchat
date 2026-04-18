import { Queue } from "bullmq";
import { redisQueue } from "./redis-queue";

export const instagramEventQueue = new Queue("instagram_event_queue", {
  connection: redisQueue,
  defaultJobOptions: {
    attempts: 3, // retry 3 times
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const instagramSendCommentQueue = new Queue(
  "instagram_send_comment_queue",
  {
    connection: redisQueue,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  },
);

export const instagramSendDMQueue = new Queue("instagram_send_dm_queue", {
  connection: redisQueue,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const instagramFollowUpMessageQueue = new Queue(
  "instagram_follow_up_message_queue",
  {
    connection: redisQueue,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  },
);
