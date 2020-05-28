const { Cluster } = require("puppeteer-cluster");
require("dotenv").config({ path: (__dirname, "../.env") });

// Browser worker Cluster
var cluster = Cluster.launch({
  concurrency: Cluster.CONCURRENCY_CONTEXT,
  maxConcurrency: parseInt(process.env.MAX_CONCURRENCY),
  puppeteerOptions: {
    headless: true,
    args: ["--no-sandbox"],
  },

})

exports.cluster = cluster;

