import { Redis } from "@upstash/redis";

/**
 * Single Redis client instance
 * Safe for serverless (Vercel)
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
