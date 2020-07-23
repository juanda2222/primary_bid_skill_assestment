

var AwsAdmin = require("./AwsAdmin.js")
var path = require("path")
var fs = require("fs")

class ConfigureServer {

    static async configureSecretFiles(app){
        
        let secrets_file_path = path.resolve(__dirname + "/../../credentials/secrets.json")
        let serialized_file

        // only download and write to disk if the file does not exists
        if (!fs.existsSync(secrets_file_path)) {

            serialized_file = await AwsAdmin.read_file_from_bucket("secrets.json", "personal-secret-files");
            fs.writeFileSync(secrets_file_path, serialized_file);

        // read from disk otherwise
        } else {
            serialized_file = fs.readFileSync(secrets_file_path)
        }

        // share the secrets through the context of the app
        app.locals = {
            secrets:JSON.parse(serialized_file)
        }
    }
}

export default ConfigureServer