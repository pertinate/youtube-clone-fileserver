import redis from 'redis';

const client = redis.createClient({
    host: 'localhost',
    port: 6379,
    password: 'mypass'
})

export const redisClient = client;