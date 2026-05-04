import apicache from "apicache";

const cache = apicache.middleware;

// 5 minutes cache
export const cacheMiddleware = cache("5 minutes");  