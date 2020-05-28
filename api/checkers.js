const base64Regex = require("is-base64");
var validUrl = require("valid-url");

const validate64 = raw => {
  /* Verifica se uma string está com o formato base64 válido.

        **Args**:
            - `raw`: String. Base64 para ser validada.

        **Returns**:
            - `Bool`: Indica se a string base64 dada é válida.
        */
  return base64Regex(raw);
};

const validateurl = url => {
  /**
     * Verifica se uma url está válida.

        **Args**:
            - `url`: String. Url para ser validada.

        **Returns**:
            - `Bool`: Indica se a URL dada é válida. */

  return validUrl.isUri(url);
};

const validate = (req,res,next) => {
  /**
     * Valida os campos url e raw e retorna o erro
     */
  if (req.body.url == null && req.body.raw == null) {
    res.status(500).send({ error :"Pelo menos um campo é necessario."});
  } else if (req.body.raw != null && req.body.url != null) {
    res.status(500).send({ error :"Apenas um campo é necessario."});
  } else if (req.body.raw != null) {
    if (validate64(req.body.raw)) {
      next();
    } else {
        res.status(500).send({ error :"Base64 inválido!"});
    }
  } else {
    if (validateurl(req.body.url)) {
      next();
    } else {
        res.status(500).send({ error :"URL invalida!"});
    }
  }
};

exports.validate = validate;