# EASY_PDF

## Como funciona

O projeto funciona como um `API` para se comunicar com os clientes externos e
com o `Puppeteer` para gerar os PDFs das páginas recebidas pela API, e um banco de dados
`Redis` para ser o meio de comunicação entre o Puppeteer e a API.


## Preparar o ambiente

1. Configure o arquivo de variáveis de ambiente `.env` presente na raiz do projeto.
2. Tenha um banco de dados `Redis` rodando


**Execute o arquivo principal do Easy_pdf**

Primeiro entre no diretório do Easy_pdf

```bash
cd easy_pdf
```

Em seguida instale as dependências usando o comando abaixo

```bash
npx install
```

Pronto, agora basta executar o easy_pdf com o comando

```bash 
npx start
```

## Obter token

Faça uma request a api na rota 

```py
"https://seudominio/login"
```

- `user`: String com o login salvo na `.env`
- `pwd`: String com a senha salva na `.env`

Se tudo ocorrer certo o retorno será algo como

```json
{
  "auth": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpYXQiOjE1OTA2NzQwMDF9.GbrSweLFjFUIwGJIJa1N8VDedK9zHWfs5iCpZ3Ty448"
}
```
## API

A Rota utilizada para gerar pdf é a seguinte:

```py
"https://seudominio/api/gerar-pdf"
```
Sempre envie o token(gerado anteriormente) no cabeçalho da requisição.

Para gerar um PDF deve ser enviado uma requisição à API passando uma das opções abaixo:

- `url`: String com o endereço web da página que deseja gerar o PDF
- `raw`: String do HTML, CSS e JavaScrip da página convertido para o formato **base64**

**Url**

String com o endereço da página. 

Por exemplo: 

```py
"https://google.com/"
```


**Raw**

String com o corpo HTML da página.

*Obs*:

- lembre-se de incluir os códigos de arquivos externos como CSS, JavaScript ao código HTML
- Lembre-se de substituir os caminhos relativos de imagens para url de acesso ou base64 da imagem. Por exemplo, ao invés de
`<img src="/imagem.jpeg">` use `<img src="https://domain.com/img/imagem.jpeg">` ou `<img src="data:image/jpeg;base64,/9j/4RPMRXhp...">`

Por exemplo, observe o código abaixo

*código original*
```html
<div>
    <h1>Ola mundo!</h1>
    <img src="../img/photo_user.jpeg" />
</div>
```

o caminho relativo do atrituo `src` deve ser trocado para um do seguintes formatos

*url de acesso*
```html
<div>
    <h1>Ola mundo!</h1>
    <img src="https://site.com/img/photo_user.jpeg" />
</div>
```

ou

*base64*
```html
<div>
    <h1>Ola mundo!</h1>
    <img src="data:image/jpeg;base64,/9j/4RPMRXhp..." />
</div>
```

Após converter para base64 você terá algo parecido com a string abaixo:

````py
"PGRpdj4NCiAgICA8aDE+T2xhIG11bmRvITwvaDE+DQogICAgPGltZyBzcmM9ImRhdGE6aW1hZ2UvanBlZztiYXNlNjQsLzlqLzRSUE1SWGhwLi4uIiAvPg0KPC9kaXY+"
````
