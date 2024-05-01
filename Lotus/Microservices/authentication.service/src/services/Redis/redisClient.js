const redis = require('redis');

const REDIS_HOST = process.env.REDIS_HOST == null ? "localhost" : process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT == null ? 6379 : process.env.REDIS_PORT;
const redisClient = redis.createClient(`redis://${REDIS_HOST}:${REDIS_PORT}`);

redisClient.connect();
redisClient.on('error', function(error) { console.error(`🟥 REDIS: ${REDIS_HOST} Error: `, error); });
redisClient.on('connect', async function() { console.log(`🟩 REDIS: ${REDIS_HOST} Successful`); });

module.exports = { redisClient };
