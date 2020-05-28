require("dotenv").config({ path: (__dirname, "../../.env") });
let jwt = require("jsonwebtoken");
let { verifyJWT } = require("./auth");
var http = require("http");
const express = require("express");
const app = express();
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const helmet = require("helmet");
const { validate } = require("./checkers");
let { save_html, gerate_name } = require("./files");
let { getUrl } = require("./url");
let { client, salvar } = require("./redis");


app.use(logger("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var server = http.createServer(app);
server.listen(3000);

//authentication
app.post("/login", (req, res, next) => {
  if (req.body.user === process.env.USER_API && req.body.pwd === process.env.PASS_API) {
    //auth ok
    const id = process.env.ID; //esse id viria do banco de dados
    var token = jwt.sign({ id }, process.env.SECRET, {
      
    });
    res.status(200).send({ auth: true, token: token });
  } else {
    res.status(500).send("Login inválido!");
  }
});

app.get("/logout", (req, res) => {
  res.status(200).send({ auth: false, token: null });
});

app.post("/api/gerar-pdf/",verifyJWT, validate, (req, res) => {
  let nome;
  if (req.body.raw) {
    nome = save_html(req.body.raw);
    salvar(client, nome, "raw", nome + ".html");
  } else {
    nome = gerate_name();
    salvar(client, nome, "url", req.body.url);
  }

  res.status(200).send({ documento: getUrl() + nome + ".pdf" });
});
