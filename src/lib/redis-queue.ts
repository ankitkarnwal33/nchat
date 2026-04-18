import { Redis } from "ioredis";

export const redisQueue = new Redis(process.env.REDIS_URL || "", {
  maxRetriesPerRequest: null,
});
