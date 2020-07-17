

var AwsAdmin = require("./AwsAdmin.js")
var path = require("path")
var fs = require("fs")

class ConfigureServer {

    static async configureSecretFiles(app){
        // this operation is safe to call various times
        let serialized_file = await AwsAdmin.read_file_from_bucket("secrets.json", "personal-secret-files");
        let secrets_file_path = path.normalize(__dirname + "/../../credentials/secrets.json")
        fs.writeFileSync(secrets_file_path, serialized_file);
        app.locals.secrets = JSON.parse(serialized_file) // share the secrets through the context of the app
    }
}

module.exports = ConfigureServer