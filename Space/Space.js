const fs = require("fs");
const mime = require("mime-types");
const AWS = require("aws-sdk");
require("dotenv").config({ path: (__dirname, "../.env") });
const path = require("path");

// Use our env vars for setting credentials
AWS.config.update({
  accessKeyId: process.env.SPACES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY
});

// Create an S3 client setting the Endpoint to DigitalOcean Spaces
var spacesEndpoint = new AWS.Endpoint(process.env.SPACES_BASE_URL_PDF);
var s3 = new AWS.S3({ endpoint: spacesEndpoint });

//Space upload
const upload = async name => {
  let filePath = process.env.PDF_PATH_TEMP + name;
  let params = {
    Bucket: process.env.BUCKET_NAME + process.env.BUCKET_DIR,
    Key: path.basename(filePath),
    Filename: name,
    ContentType: mime.lookup(filePath),
    Body: fs.createReadStream(filePath),
    ACL: "public-read"
  };

  s3.upload(params, function(err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log("Upload executado");
    }
  });
};

exports.upload = upload;
exports.s3 = s3;
