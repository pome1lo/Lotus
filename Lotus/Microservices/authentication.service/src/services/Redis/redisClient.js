const redis = require('redis');




const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
// const redisClient = redis.createClient(`redis://${REDIS_HOST}:${REDIS_PORT}`);
const redisClient = redis.createClient(`redis://127.0.0.1:6379`);

console.log("🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨\n\n" + process.env.REDIS_HOST + "\n\n🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨🟨");


function handleRedisError(error) {
    console.error(`🟥 REDIS: ${REDIS_HOST} Error: `, error);
}

function handleRedisConnect() {
    console.log(`🟩 REDIS: ${REDIS_HOST} Successful`);
}

redisClient.connect();
redisClient.on('error', handleRedisError);
redisClient.on('connect', handleRedisConnect);

module.exports = { redisClient };
