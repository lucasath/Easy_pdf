
const teste = async (client) => {
    try {
      client.hmset("laravel", "raw", "index.html");

      client.hmset("djanbo", "raw", "djanbo.html");

      client.hmset("google", "url", "https://www.google.com.br");

      client.rpush([process.env.FILA, "laravel", "djanbo", "google"], function(
        err,
        reply
      ) {});
    } catch (error) {
      throw error;
    }
  }

  exports.teste = teste
