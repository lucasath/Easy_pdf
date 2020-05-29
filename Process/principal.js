const { upload } = require("../Space/Space.js");

//Execute query redis and print ps:Callbackhell redis
// TODO Change to Async lib
// Obsolet function
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

// New execute function
const execute2 = async (client, cluster) => {
  fila = await getfila(client);

  fila.forEach(async element => {
    primeiro = await getprimeiro(client);

    if (primeiro != null) {
      lista = await getlista(client, primeiro);

      if (lista != null) {
        if (lista.url != null) {
          cluster.queue({ url: lista.url, file: primeiro }, print);

          await deletelist(client, primeiro);
        } else if (lista.raw != null) {
          cluster.queue(
            {
              url: "file:///" + process.env.HTML_PATH + lista.raw,
              file: primeiro
            },
            print
          );

          await deletelist(client, primeiro);
        }
      }
    }
  });
};

const getfila = async client => {
  return new Promise((resolve, reject) => {
    client.lrange(process.env.FILA, 0, -1, (err, ret) => {
      resolve(ret);
    });
  });
};

const getprimeiro = async client => {
  return new Promise((resolve, reject) => {
    client.lpop(process.env.FILA, (err, ret) => {
      resolve(ret);
    });
  });
};

const getlista = async (client, reply) => {
  return new Promise((resolve, reject) => {
    client.hgetall(reply, (err, value) => {
      resolve(value);
    });
  });
};

const deletelist = async (client, element) => {
  return new Promise((resolve, reject) => {
    client.del(element);
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
exports.execute = execute2;
