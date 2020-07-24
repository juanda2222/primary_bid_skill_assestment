import { app } from "../types/ExpressTypes"


var AwsAdmin = require("./AwsAdmin")
var path = require("path")
var fs = require("fs")

class ConfigureServer {

    static async configureSecretFiles(app: app){
        
        let credentials_folder_path = path.resolve(__dirname + "/../../../credentials")
        let secrets_file_path = credentials_folder_path + "/secrets.json"
        let serialized_file

        // only download and write to disk if the file does not exists
        if (!fs.existsSync(secrets_file_path)) {

            //create folder if it does not exists
            if (!fs.existsSync(credentials_folder_path)) {
                fs.mkdirSync(credentials_folder_path); //create folder
            }

            console.debug("Downloading secrets file...")
            serialized_file = await AwsAdmin.read_file_from_bucket("secrets.json", "personal-secret-files");
            fs.writeFileSync(secrets_file_path, serialized_file);
        
        // read from disk otherwise
        } else {
            console.debug("Secrets file already downloaded")
            serialized_file = fs.readFileSync(secrets_file_path)
        }

        // share the secrets through the context of the app
        app.locals = {
            secrets:JSON.parse(serialized_file)
        }
    }
}

module.exports = ConfigureServer
export default ConfigureServer