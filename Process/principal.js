const { upload } = require("../Space/Space.js");

//Execute query redis and print ps:Callbackhell redis
// TODO Change to Async lib
const execute = async (client, cluster) => {
  client.lrange(process.env.FILA, 0, -1, (err, ret) => {
    ret.forEach(element => {
      client.lpop(process.env.FILA, (err, reply) => {
        if (reply != null) {
          client.hgetall(reply, (err, value) => {
            if (value != null) {
              if (value.url != null) {
                cluster.queue({ url: value.url, file: reply }, print);
                client.del(reply);
              } else if (value.raw != null) {
                cluster.queue(
                  {
                    url: "file:///" + process.env.HTML_PATH + value.raw,
                    file: reply
                  },
                  print
                );
                client.del(reply);
              }
            }
          });
        }
      });
    });
  });
};

//Print and s3 upload
const print = async ({ page, data }) => {
  const name = data.file + ".pdf";

  await page.goto(data.url);

  await page.pdf({
    path: process.env.PDF_PATH_TEMP + name,
    preferCSSPageSize: true,
    printBackground: true
  });

  console.log(`PDF of ${data.url} saved: ${name}`);

  await upload(name);

  await page.close();
};

exports.print = print;
exports.execute = execute;
