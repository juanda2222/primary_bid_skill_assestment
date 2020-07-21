
//constants
const REGION = 'us-east-1'
const EKS_CLUSTER_NODE_STACK = "https://amazon-eks.s3.us-west-2.amazonaws.com/cloudformation/2020-06-10/amazon-eks-nodegroup-role.yaml"
const EKS_NAME = "personal-eks-cluster" 


var AWS = require('aws-sdk');

// Set the region
AWS.config.update({ region: REGION });

// Create aws services objects
var cloudformation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });

class CreateNodeGroup {

    static async create_node_group_iam() {

        //----------------------------------------
        // create the eKs node grup using a stack
        //----------------------------------------

        var params = {
            StackName: "eks-node-group-stack", /* required */
            TemplateURL: EKS_CLUSTER_NODE_STACK,
            Capabilities: ["CAPABILITY_IAM"]
        };

        await new Promise((fulfill, reject) => {
            cloudformation.createStack(params, function (err, data) {
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

    // this should be executed after CsreateCluster.js
    CreateNodeGroup.create_node_group()
    console.log("Well done!")
    console.log("")
    console.log("Now connect the group node iam with a node (you have to create it manually)")
    console.log("Go here to create the node: (you might need to adjust the url)")
    console.log(`https://console.aws.amazon.com/eks/home?region=${REGION}#/clusters/${EKS_NAME}`)

}

module.exports = CreateNodeGroup
