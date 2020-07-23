

var fs = require("fs")
var path = require("path")
var Database = require("../../server/modules/Database");
var { json } = require("body-parser");

describe("Testing the database manager", () => {

    // get the secret data
    const secrets_path = path.resolve(__dirname+"/../../credentials/secrets.json")
    const secrets = JSON.parse(fs.readFileSync(secrets_path))

    // initialize the manager and helper shared vars
    const database = new Database(secrets.db_user, secrets.db_password)
     
    
    test("This should connect correctly to the db", async () => {
        
        //config the test max timeout
        jest.setTimeout(20000);

        await database.connect()
        console.debug(">>>> Connected to the database")
        await database.close()
        console.debug(">>>> Database closed")

        expect(database).toBeInstanceOf(Database);
        
    });
    
    test("Inserting a dumb url in the database", async () => {
        
        //config the test max timeout
        jest.setTimeout(20000);

        const userId = "dumb_userid_232dwd"
        const urlId = "dumb1234"
        const url = "dumb.primarybid.com/somepath/somefile?var1=21234&var2=1234345var3=234323212jfi3e0i3ej20"
        let op_result = null
        let document = null

        try {

            await database.connect()
            console.debug(">>>> Connected to the database")
            op_result = await database.create_url_entry(userId, urlId, url)
            console.debug(">>>> dumb url created!")
            document = op_result.ops[0] // just one because we use (insertOne)
            //console.debug(">>>> Operation results:", op_result.result)
            //console.debug(">>>> Operation connection:", op_result.connection)
            console.debug(">>>> Operation document:", document) 

        } catch (error) {
            console.debug(`--- Error creating the document ${document._id}`)
            console.debug(`--- Error:`, error)
        } finally {

            await database.close()
            console.debug(">>>> Database closed")
        }

        expect(document).toHaveProperty("userId", userId)
        
    });

    test("Delete the dumb url inserted in the database", async () => {
        
        //config the test max timeout
        jest.setTimeout(20000);
        let del_result = null
        let insert_result = null

        try {
            
            await database.connect()

            const userId = "userid_to_delete"
            const urlId = "delete12"
            const url = "delete.primarybid.com/somepath/somefile?var1=21234&var2=1234345var3=234323212jfi3e0i3ej20"
            
            insert_result = await database.create_url_entry(userId, urlId, url)
            console.debug(">>>> url to delete created!")

            del_result = await database.delete_url_entry(insert_result.ops[0]._id) 
            console.debug(">>>> url deleted!")
            //console.debug(">>>> Operation connection:", del_result)
            console.debug(">>>> Records affected:", del_result.deletedCount)

        } catch (error) {

            console.debug(`--- Error deleting the document ${insert_result.ops[0]._id}`)
            console.debug(`--- Error:`, error)

        }finally{
            await database.close()
            console.debug(">>>> Database closed")
        }       

        expect(del_result.deletedCount).toEqual(1)
        
    });

    test("Get a set of records from the database", async () => {
        
        //config the test max timeout
        jest.setTimeout(20000);

        
        let doc_list = null
        const maximumNumberOfResults = 10

        try {
            
            await database.connect()
            console.debug(">>>> Connected to the database")
            doc_list = await database.get_all_urls(maximumNumberOfResults) 
            console.debug(">>>> Result list:", doc_list)

        } catch (error) {

            console.debug(`--- Error getting the documents`, error)

        }finally{
            await database.close()
            console.debug(">>>> Database closed")
        }       

        expect(doc_list.length).toBeLessThanOrEqual(maximumNumberOfResults)
        expect(doc_list.length).toBeGreaterThan(0)
        
    });
    

    test("Get a set of records from the database using a userId", async () => {
        
        //config the test max timeout
        jest.setTimeout(20000);

        
        let doc_list = null
        const maximumNumberOfResults = 10

        try {
            
            await database.connect()
            console.debug(">>>> Connected to the database")
            doc_list = await database.get_urls_by_user_id("dumb_userid_232dwd", maximumNumberOfResults) 
            console.debug(">>>> Result list:", doc_list)

        } catch (error) {

            console.debug(`--- Error getting the documents`, error)

        }finally{
            await database.close()
            console.debug(">>>> Database closed")
        }       

        expect(doc_list.length).toBeLessThanOrEqual(maximumNumberOfResults)
        expect(doc_list.length).toBeGreaterThan(0)
        
    });
});