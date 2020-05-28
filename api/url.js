require("dotenv").config({ path: (__dirname, "../../.env") });

let getUrl = ()=>{
    let url_base = 'https://'+ process.env.BUCKET_NAME +'.'+ process.env.SPACES_BASE_URL_PDF + process.env.BUCKET_DIR+'/';

    return url_base;
}


exports.getUrl = getUrl;