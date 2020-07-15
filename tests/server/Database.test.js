
const fs = require("fs")
const path = require("path")
const Database = require("../../server/modules/Database.js")

describe("Testing the database", () => {
    // syncronous test
    //test()
    
    // asyncronous test
    it("This should connect correctly to the db", async () => {
        
        //config the test max timeout
        jest.setTimeout(30000);

        // get the secret data
        const secrets_path = path.normalize(__dirname+"/../../credentials/secrets.json")
        const secrets = JSON.parse(fs.readFileSync(secrets_path))

        const database = new Database(secrets.db_user, secrets.db_password)
        await database.connect()
        
        console.log("Connected to the database")
        console.log(database)
        console.log(database.client)
        console.log("Closing the database")
        database.close()

        expect(database).toBeInstanceOf(Database);
        
    });
});