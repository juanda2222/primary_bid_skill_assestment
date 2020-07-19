

var path = require("path")
var fs = require('fs');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Set the region
AWS.config.update({ region: 'us-east-1' });

// Create S3 service object
let s3 = new AWS.S3({ apiVersion: '2006-03-01' });

class AwsAdmin {

    static async config_project() {
        AWS.config.loadFromPath(path.resolve(__dirname + "/../../credentials/aws_config.json"));
        return true
    }

    static async get_buckets_list() {

        return new Promise((fulfill, reject) => {

            // Call S3 to list the buckets
            s3.listBuckets(function (err, data) {
                if (err) {
                    console.log("Error", err);
                    reject(`Error! ${err}`)
                } else {
                    console.log("Buckets retrieved! info:", data); // some owner information in here
                    fulfill(data.Buckets) // list of buckets
                }
            });
        })

    }

    static async create_bucket(bucket_name) {

        // Create the parameters for calling createBucket
        var bucketParams = {
            Bucket: bucket_name
        };

        return new Promise((fulfill, reject) => {

            // call S3 to create the bucket
            s3.createBucket(bucketParams, function (err, data) {
                if (err) {
                    console.log("Error", err);
                    reject(false)
                } else {
                    console.log("Success creating! info:", data);
                    fulfill(true)
                }
            });
        })
    }

    static async delete_bucket(bucket_name) {
        
        // Create params for S3.deleteBucket
        var bucketParams = {
            Bucket : bucket_name
        };

        // Call S3 to delete the bucket
        return new Promise((fulfill, reject) => {
            s3.deleteBucket(bucketParams, function(err, data) {
                if (err) {
                    console.log("Error", err);
                    reject(false)
                } else {
                    console.log("Success deleting!", data);
                    fulfill(true)
                }
            })
        });
    }

    static async upload_file(file_path, bucket_name) {
        

        // call S3 to retrieve upload file to specified bucket
        var uploadParams = {Bucket: bucket_name, Key: '', Body: ''};

        // Configure the file stream and obtain the upload parameters
        var fileStream = fs.createReadStream(file_path);
        fileStream.on('error', function(err) {
            console.log('File Error', err);
        });
        uploadParams.Body = fileStream;
        uploadParams.Key = path.basename(file_path); // this is jusst the name of the file:
        //console.log("Upload params: ", uploadParams)

        // call S3 to retrieve upload file to specified bucket (return it as a promise)
        return new Promise((fulfill, reject) => {
            
            s3.upload (uploadParams, function (err, data) {
                if (err) {
                    console.log("Error", err);
                    reject(false)
                } if (data) {
                    console.log("File info", data);
                    fulfill(true)
                }
            });
        })
    }
    
    static async read_file_from_bucket(file_basename, bucket_name){
        
        // Create the parameters for calling listObjects
        var downloadParams = {
            Bucket : bucket_name,
            Key: file_basename
        };

        return new Promise((fulfill, reject) => {
            
            s3.getObject(downloadParams, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    console.log("File readed!");
                    console.log(data);
                    fulfill(data.Body.toString("utf-8"))
                }  
            });
        });
    }
   
}

//if the module is main execute the example
if (module === require.main) {
    // this are only needed at the start to configure the project
    
    AwsAdmin.config_project()
    AwsAdmin.create_bucket("personal-secret-files")
    AwsAdmin.create_bucket("unique-testbucket-12345") //testing bucket
    let secrets_file_path = path.normalize(__dirname + "/../../credentials/secrets.json")
    AwsAdmin.upload_file(secrets_file_path, "personal-secret-files")

    // this are used as helper functions
    //AwsAdmin.get_buckets_list()
    //AwsAdmin.delete_bucket(<BUCKET_NAME>)
    

}

module.exports = AwsAdmin
