const redis = require('redis');

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(`redis://${REDIS_HOST}:${REDIS_PORT}`);

function handleRedisError(error) {
    console.error(`🟥 REDIS: ${REDIS_HOST} Error: `, error);
}

function handleRedisConnect() {
    console.log(`🟩 REDIS: ${REDIS_HOST} Successful`);
}

client.connect();
client.on('error', handleRedisError);
client.on('connect', handleRedisConnect);

module.exports = client;
