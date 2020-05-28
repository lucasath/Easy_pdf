const redis = require("redis");
const retryStrategy = require("node-redis-retry-strategy");
require("dotenv").config({ path: (__dirname, "../../.env") });

var client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retry_strategy: retryStrategy()
});

client.on("connect", () => console.log("Api Redis Connected: "));

client.on("error", err => {
  console.log("api redis client Error " + err);
  console.log("reconnecting~~~~~~~");
  client = redis.createClient();
});

const salvar = async (client ,name, type, value) =>{
  try {
    client.hmset(name, type, value);

    client.rpush([process.env.FILA, name], function(
      err,
      reply
    ) {});
  } catch (error) {
    throw error;
  }

}

exports.salvar = salvar;
exports.client = client;