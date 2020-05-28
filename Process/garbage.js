const fs = require("fs");
const moment = require("moment");
require("dotenv").config({ path: (__dirname, "../../.env") });
const { s3 } = require("../Space/Space.js");

// Garbage Collector Runner
async function garbageCollector() {
  fs.readdir(process.env.PDF_PATH_TEMP, (err, filesList) => {
    if (err) throw err;
    filesList.forEach(element => {
      fs.stat(process.env.PDF_PATH_TEMP + element, (err, stats) => {
        let dif = moment(new Date()).diff(new Date(stats.mtime), "minutes");
        if (dif > process.env.EXPIRE) {
          dellocal(process.env.PDF_PATH_TEMP + element);
          delcloud(element);
        }
      });
    });
  });
}

const garbage = async function task() {
  // Task Garbage Collector
  setInterval(() => {
    garbageCollector();
    console.log("Garbage Collector");
  }, process.env.GARBAGE * 60000);
};

async function dellocal(filepath) {
  fs.unlink(filepath, function(err) {
    if (err) {
      throw err; //error
    }
  });
}

// Delete From Cloud
async function delcloud(file) {
  let params = {
    Bucket: process.env.BUCKET_NAME + process.env.BUCKET_DIR, // the name of your bucket
    Key: file // name of object in S3
  };
  s3.deleteObject(params, (err, data) => {
    if (err) {
      throw err; // error
    }
  });
}

exports.garbage = garbage;
