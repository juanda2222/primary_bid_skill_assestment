

var path = require("path")
var fs = require('fs');
import {AWSError} from 'aws-sdk/lib/error';

// Load the AWS SDK for Node.js
var AwsCli = require('aws-sdk');

//constants
const REGION = 'us-east-1'

// Set the region
AwsCli.config.update({ region: REGION });

// Create aws services objects
let s3 = new AwsCli.S3({ apiVersion: '2006-03-01' });
var cloudformation = new AwsCli.CloudFormation({ apiVersion: '2010-05-15' });
var iam = new AwsCli.IAM({ apiVersion: '2010-05-08' });


class AwsAdmin {

    static async config_project() {
        AwsCli.config.loadFromPath(path.resolve(__dirname + "/../../credentials/aws_config.json"));
        return true
    }

    static async get_buckets_list() {

        return new Promise((fulfill, reject) => {

            // Call S3 to list the buckets
            s3.listBuckets( (err:AWSError, data:any) => {
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

    static async create_bucket(bucket_name:string) {

        // Create the parameters for calling createBucket
        var bucketParams = {
            Bucket: bucket_name
        };

        return new Promise((fulfill, reject) => {

            // call S3 to create the bucket
            s3.createBucket(bucketParams, function (err:AWSError, data:any) {
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

    static async delete_bucket(bucket_name: string) {

        // Create params for S3.deleteBucket
        var bucketParams = {
            Bucket: bucket_name
        };

        // Call S3 to delete the bucket
        return new Promise((fulfill, reject) => {
            s3.deleteBucket(bucketParams, function (err:AWSError, data:any) {
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

    static async upload_file(file_path:string, bucket_name:string) {


        // call S3 to retrieve upload file to specified bucket
        var uploadParams = { Bucket: bucket_name, Key: '', Body: '' };

        // Configure the file stream and obtain the upload parameters
        var fileStream = fs.createReadStream(file_path);
        fileStream.on('error', (err:string) => {
            console.log('File Error', err);
        });
        uploadParams.Body = fileStream;
        uploadParams.Key = path.basename(file_path); // this is jusst the name of the file:
        //console.log("Upload params: ", uploadParams)

        // call S3 to retrieve upload file to specified bucket (return it as a promise)
        return new Promise((fulfill, reject) => {

            s3.upload(uploadParams, (err:AWSError, data:any) => {
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

    static async read_file_from_bucket(file_basename:string, bucket_name:string) {

        // Create the parameters for calling listObjects
        var downloadParams = {
            Bucket: bucket_name,
            Key: file_basename
        };

        return new Promise((fulfill, reject) => {

            s3.getObject(downloadParams, (err:AWSError, data:any) => {
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
    
    // this are used as helper functions:
    //AwsAdmin.get_buckets_list()
    //AwsAdmin.delete_bucket(<BUCKET_NAME>)
}


module.exports = AwsAdmin
