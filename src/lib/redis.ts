import { createClient } from "redis";

const globalForRedis = global as unknown as {
  redis: ReturnType<typeof createClient> | undefined;
};

export const redis =
  globalForRedis.redis ??
  createClient({
    url: process.env.REDIS_URL!,
    socket: {
      reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
    },
  });

if (!redis.isOpen) {
  redis.connect().catch(console.error);
}

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
