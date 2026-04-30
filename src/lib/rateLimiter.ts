import { redis } from "./redis";

const RATE_LIMIT_LUA = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local bucket = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(bucket[1]) or capacity
local last_refill = tonumber(bucket[2]) or now

local elapsed = (now - last_refill) / 1000
local refill = elapsed * refill_rate
tokens = math.min(capacity, tokens + refill)

if tokens >= 1 then
  tokens = tokens - 1
  redis.call('HSET', key, 'tokens', tokens, 'last_refill', now)
  redis.call('EXPIRE', key, 7200)
  return {1, math.ceil((1 - tokens) / refill_rate * 1000)}
else
  local wait_ms = math.ceil((1 - tokens) / refill_rate * 1000)
  return {0, wait_ms}
end
`;

export async function acquireToken(
  accountId: string,
  capacity: number,
): Promise<{ allowed: boolean; waitMs: number }> {
  // Instagram rate limit is 195 public replies and 750 for private replies per 3600 seconds
  const result = (await redis.eval(RATE_LIMIT_LUA, {
    keys: [`rate:ig:${accountId}`],
    arguments: [`${capacity}`, String(capacity / 3600), String(Date.now())],
  })) as [number, number];
  return { allowed: result[0] === 1, waitMs: result[1] };
}
