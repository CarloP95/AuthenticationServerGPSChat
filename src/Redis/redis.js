var Redis = require('ioredis');


const expireString = "EX", expirePeriod = 30 * 60; //Seconds

var redisClient = new Redis({
	password: process.env.REDIS_KEY,
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	family: 4,
	db: 0
});

function writeValueInRedis(key, value) {

	redisClient.set(key, value, "EX", expirePeriod).then(data => {
		if (data === "OK")
			console.log("Redis is updated.");
	});
}

function checkValueInRedis(key, value) {

	redisClient.get(key, (err, result) => {
		if (err) {
			console.error(err);
			return false;
		}
		
		return result == value;
		
	});

}

module.exports = {
	checkValueInRedis : checkValueInRedis,
	writeValueInRedis : writeValueInRedis
}