require("dotenv").config({ path: (__dirname, "../.env") });
//redis
const { client } = require("./Process/redis");
const { teste } = require("./Test/Test.js");
const { garbage } = require("./Process/garbage");
//api
require("./api/api");

(async () => {
  //await teste(client);
  //Garbage Runner
  garbage();

})();
