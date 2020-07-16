
const fs = require("fs")
const path = require("path")
const AwsAdmin = require("../../server/modules/AwsAdmin.js");


describe("Testing the AwsAdmin module", () => {
    test("Testing configuring the project with the credentials", async () => {
        
        //config the test max timeout
        jest.setTimeout(10000);
        let is_done = null 
        
        try {
            is_done = await AwsAdmin.config_project()    
        } catch (error) {
            console.debug(`--- Error configuring the project`)
            console.debug(`--- Error:`, error)
        }

        expect(is_done).toBe(true);
        
    });
     
    test("Testing reading the buckets information", async () => {
        
        //config the test max timeout
        jest.setTimeout(20000);
        let buckets_list = null
        
        try {
            buckets_list = await AwsAdmin.get_buckets_list()    
        } catch (error) {
            console.debug(`--- Error reading the buckets information`)
            console.debug(`--- Error:`, error)
        }
        

        expect(buckets_list.length).toBeGreaterThan(0)
        
    });

    test("Testing the bucket creation and deletion", async () => {
        
        //config the test max timeout
        jest.setTimeout(10000);
        let creation_is_done = null
        let deletion_is_done = null

        // create the bucket mini test
        try {
            creation_is_done = await AwsAdmin.create_bucket("some-bucket-name-unique-to-delete")    
        } catch (error) {
            console.debug(`--- Error creating the bucket`)
            console.debug(`--- Error:`, error)
        }

        expect(creation_is_done).toBe(true);

        // delete the bucket mini test
        try {
            deletion_is_done = await AwsAdmin.delete_bucket("some-bucket-name-unique-to-delete")    
        } catch (error) {
            console.debug(`--- Error deleting the bucket`)
            console.debug(`--- Error:`, error)
        }

        expect(deletion_is_done).toBe(true);
        
    });
    
    test("Testing the writing reading and deleting a file to the bucket", async () => {
        
        //config the test max timeout
        jest.setTimeout(10000);

        // save a known file from command line
        let test_object = {test_property:"test_value"};
        let test_file_path = "./test_file_to_upload.json"
        let serialized_file = JSON.stringify(test_object)
        fs.writeFileSync(test_file_path, serialized_file)
        let downloaded_file = null

        //upload the known file
        try {
            creation_is_done = await AwsAdmin.upload_file(test_file_path, "unique-testbucket-12345")    
        } catch (error) {
            console.debug(`--- Error uploading the file`)
            console.debug(`--- Error:`, error)
        }

        expect(creation_is_done).toBe(true);

        //read the known file
        try {
            let file_basename = path.basename(test_file_path);
            downloaded_file = await AwsAdmin.read_file_from_bucket(file_basename, "unique-testbucket-12345")    
        } catch (error) {
            console.debug(`--- Error downloading the file`)
            console.debug(`--- Error:`, error)
        }

        var result_object = JSON.parse(downloaded_file)
        expect(JSON.stringify(result_object)).toBe(serialized_file);

        //delete the file created
        // pending ...
        
    });
});