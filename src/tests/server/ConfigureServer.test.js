


var fs = require("fs")
var path = require("path")
var ConfigureServer = require("../../server/modules/ConfigureServer");

describe("Testing the server configuration 'on creation'", () => {

    test("This should download the secret file before fufilling the promise", async () => {
        
        //config the test max timeout
        jest.setTimeout(10000);
        let mock_app = {locals:{}}

        // download the file 
        const returnPromise = ConfigureServer.configureSecretFiles(mock_app)
     
        //check if the file was downloaded
        const secrets_path = path.resolve(__dirname+"/../../credentials/secrets.json")
        console.log(returnPromise) //pending
        await returnPromise // wait for the promise to resolve to read the file
        const file_readed =  JSON.parse(fs.readFileSync(secrets_path))

        // Expect the json to contain the properties:
        expect(file_readed).toHaveProperty('db_user',)
        expect(file_readed).toHaveProperty('db_password',)
        
    });
    
});