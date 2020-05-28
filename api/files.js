const fs = require("fs");
require("dotenv").config({ path: (__dirname, "../../.env") });
let { v4: uuidv4 } = require("uuid");

const save_html = html64 => {
  let decoded = Buffer.from(html64, "base64").toString("utf-8");
  let file_name = gerate_name();
  fs.writeFile(process.env.HTML_PATH + file_name + ".html", decoded, err => {
    //Caro ocorra algum erro
    if (err) {
      return console.log("erro");
    }
    //Caso não tenha erro, retornaremos a mensagem de sucesso
    console.log("Arquivo Criado");
  });
  return file_name;
};

const gerate_name = () => {
  let name = uuidv4();
  return name;
};

exports.save_html = save_html;
exports.gerate_name = gerate_name;
