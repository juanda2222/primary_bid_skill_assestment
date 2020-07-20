

var path = require("path")
var fs = require('fs');
YAML = require('yamljs');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');


// Set the region
AWS.config.update({ region: 'us-east-1' });

// Create aws services objects
let s3 = new AWS.S3({ apiVersion: '2006-03-01' });
var cloudformation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
var iam = new AWS.IAM({ apiVersion: '2010-05-08' });

const kubernetes_stack_properties = "https://amazon-eks.s3.us-west-2.amazonaws.com/cloudformation/2020-06-10/amazon-eks-vpc-private-subnets.yaml"
const stack_name = "personal-stack"
const eks_name = "personal_eks_cluster" 

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
            Bucket: bucket_name
        };

        // Call S3 to delete the bucket
        return new Promise((fulfill, reject) => {
            s3.deleteBucket(bucketParams, function (err, data) {
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
        var uploadParams = { Bucket: bucket_name, Key: '', Body: '' };

        // Configure the file stream and obtain the upload parameters
        var fileStream = fs.createReadStream(file_path);
        fileStream.on('error', function (err) {
            console.log('File Error', err);
        });
        uploadParams.Body = fileStream;
        uploadParams.Key = path.basename(file_path); // this is jusst the name of the file:
        //console.log("Upload params: ", uploadParams)

        // call S3 to retrieve upload file to specified bucket (return it as a promise)
        return new Promise((fulfill, reject) => {

            s3.upload(uploadParams, function (err, data) {
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

    static async read_file_from_bucket(file_basename, bucket_name) {

        // Create the parameters for calling listObjects
        var downloadParams = {
            Bucket: bucket_name,
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

    static async create_kubernetes_stack() {

        // --------------
        // the VPN stack
        //---------------

        var params = {
            StackName: stack_name, /* required */
            TemplateURL: kubernetes_stack_properties,
            //TimeoutInMinutes: '30', //time before the stack creation fails
            Parameters: [
                {
                    ParameterKey: "VpcBlock",
                    ParameterValue: "192.168.0.0/16"
                }, {
                    ParameterKey: "PublicSubnet01Block",
                    ParameterValue: "192.168.0.0/18"
                }, {
                    ParameterKey: "PublicSubnet02Block",
                    ParameterValue: "192.168.64.0/18"
                }, {
                    ParameterKey: "PrivateSubnet01Block",
                    ParameterValue: "192.168.128.0/18"
                }, {
                    ParameterKey: "PrivateSubnet02Block",
                    ParameterValue: "192.168.192.0/18"
                }
            ]
        };
        
        await cloudformation.createStack(params, function (err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data);           // successful response
        });

    }

    static async create_kubernetes_iam_role_with_policys() {
        //------------------------
        // create the eKs iam_role
        //------------------------
        const AssumePolicyDocument = JSON.stringify({
            Version: '2012-10-17',
            Statement:{
                Effect: "Allow",
                Principal:{
                    Service:"eks.amazonaws.com"
                    
                },
                Action:"sts:AssumeRole"
            }
        })

        var params = {
            AssumeRolePolicyDocument: AssumePolicyDocument, /* required */
            RoleName: "Amazon-EKS-Cluster-Role", /* required */
            Description: "The role that Amazon EKS will use to create AWS resources for Kubernetes clusters"
        };

        await new Promise((fulfill, reject) => {
            iam.createRole(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                    reject(err)
                }else {
                    console.log(data);           // successful response
                    fulfill(data)
                }
            });
        })

        //------------------------------
        // attach the policy to the role
        //------------------------------

        var params = {
            PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy", 
            RoleName: "Amazon-EKS-Cluster-Role"
        };
        
        await new Promise((fulfill, reject) => {
             iam.attachRolePolicy(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                    reject(err)
                }else {
                    console.log(data);           // successful response
                    fulfill(data)
                }
            });
        })

    }
}

//if the module is main execute the example
if (module === require.main) {
    // this are only needed at the start to configure the project

    //AwsAdmin.config_project()
    //AwsAdmin.create_bucket("personal-secret-files")
    //AwsAdmin.create_bucket("unique-testbucket-12345") //testing bucket
    //let secrets_file_path = path.normalize(__dirname + "/../../credentials/secrets.json")
    //AwsAdmin.upload_file(secrets_file_path, "personal-secret-files")
    //AwsAdmin.create_kubernetes_stack()
    AwsAdmin.create_kubernetes_iam_role_with_policys()

    // this are used as helper functions
    //AwsAdmin.get_buckets_list()
    //AwsAdmin.delete_bucket(<BUCKET_NAME>)


}


module.exports = AwsAdmin
