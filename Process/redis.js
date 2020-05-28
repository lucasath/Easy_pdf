const redis = require("redis");
const retryStrategy = require("node-redis-retry-strategy");
const { execute } = require("./principal.js");
var { cluster } = require("./cluster");
require("dotenv").config({ path: (__dirname, "../../.env") });

var client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retry_strategy: retryStrategy()
});

client.on("connect", () => console.log("Redis Connected: "));

client.on("error", err => {
  console.log("redis client Error " + err);
  console.log("reconnecting~~~~~~~");
  client = redis.createClient();
});

// Monitor redis
client.monitor(function(err, res) {
  console.log("Monitor Redis online.");
});

// Monitor for redis rpush
client.on("monitor", async function(time, args, rawReply) {
  if (args[0].toLowerCase() == "rpush") {
    console.log("executando...");
    work = await cluster;
    await execute(client, work);
  }
});

exports.client = client;
