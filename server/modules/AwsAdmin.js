

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
        AWS.config.loadFromPath(path.normalize(__dirname + "/../../credentials/aws_config.json"));
    }

    static async get_buckets_list() {

        return new Promise((fulfill, reject) => {

            // Call S3 to list the buckets
            s3.listBuckets(function (err, data) {
                if (err) {
                    console.log("Error", err);
                    throw `Error! ${err}`
                } else {
                    console.log("Success!", data); // some owner information in here
                    console.log("Buckets", data.Buckets); // list of buckets
                    return data.Buckets
                }
            });
        })

    }

    static async create_secret_bucket() {

        // Create the parameters for calling createBucket
        var bucketParams = {
            Bucket: "personal-secret-files"
        };

        return new Promise((fulfill, reject) => {

            // call S3 to create the bucket
            s3.createBucket(bucketParams, function (err, data) {
                if (err) {
                    console.log("Error", err);
                    reject()
                } else {
                    console.log("Success info", data);
                    fulfill()
                }
            });
        })
    }

    static async upload_secret_file() {
        

        // call S3 to retrieve upload file to specified bucket
        var uploadParams = {Bucket: process.argv[2], Key: '', Body: ''};

        // Configure the file stream and obtain the upload parameters
        var file_path = path.normalize(__dirname + "/../../credentials/secrets.json")
        var fileStream = fs.createReadStream(file_path);
        fileStream.on('error', function(err) {
            console.log('File Error', err);
        });
        uploadParams.Body = fileStream;
        uploadParams.Key = path.basename(file);

        // call S3 to retrieve upload file to specified bucket (return it as a promise)
        return new Promise((fulfill, reject) => {
            
            s3.upload (uploadParams, function (err, data) {
                if (err) {
                    console.log("Error", err);
                    reject()
                } if (data) {
                    console.log("Upload Success", data.Location);
                    fulfill()
                }
            });
        })
    }
}

//if the module is main execute the example
if (module === require.main) {
    // this are only needed at the start to configure the project
    //AwsAdmin.config_project()
    //AwsAdmin.create_secret_bucket()
    AwsAdmin.upload_secret_file()

    // this are used as helper functions
    AwsAdmin.get_buckets_list()

}

module.exports = AwsAdmin
