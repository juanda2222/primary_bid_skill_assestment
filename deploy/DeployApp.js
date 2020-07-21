
//constants
const REGION = 'us-east-1'
const EKS_CLUSTER_NODE_STACK = "https://amazon-eks.s3.us-west-2.amazonaws.com/cloudformation/2020-06-10/amazon-eks-nodegroup-role.yaml"
const EKS_NAME = "personal-eks-cluster" 
const APP_NAME = "url-shortener"

var AWS = require('aws-sdk');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Set the region
AWS.config.update({ region: REGION });

// Create aws services objects
var cloudformation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });


class CreateApp {

    static async create_namespace() {

        // create the name entry for the app
        const command = `kubectl create namespace ${APP_NAME}`
        const { stdout, stderr } = await exec(command);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    }
}

//if the module is main execute the example
if (module === require.main) {
    CreateApp.create_namespace()

}

module.exports = CreateNodeGroup
