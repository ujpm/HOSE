import NodeCache from 'node-cache';

// Initialize cache with standard TTL of 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

const cacheMiddleware = (duration) => (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
        return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        res.send(cachedResponse);
        return;
    } else {
        res.sendResponse = res.send;
        res.send = (body) => {
            cache.set(key, body, duration);
            res.sendResponse(body);
        };
        next();
    }
};

export const clearCache = (key) => {
    if (key) {
        cache.del(key);
    } else {
        cache.flushAll();
    }
};

export default cacheMiddleware;
