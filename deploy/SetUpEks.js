

var path = require("path")
var fs = require('fs');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

//constants
const KUBERNETES_VPN_STACK = "https://amazon-eks.s3.us-west-2.amazonaws.com/cloudformation/2020-06-10/amazon-eks-vpc-private-subnets.yaml"
const REGION = 'us-east-1'


// Set the region
AWS.config.update({ region: REGION });

// Create aws services objects
var cloudformation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });


class SetUpEks {

    static async create_kubernetes_iam_role_with_policys() {

        //----------------------------------------------------
        // create the eKs iam_role with policys using a stack
        //----------------------------------------------------

        let iam_stack_path = path.resolve(__dirname + "/iam_stack.yaml")
        let serialized_iam_stack_description = fs.readFileSync(iam_stack_path).toString()

        var params = {
            StackName: "eks-iam-stack", /* required */
            TemplateBody: serialized_iam_stack_description,
            Capabilities: ["CAPABILITY_IAM"]
            //TimeoutInMinutes: '30', //time before the stack creation fails
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

    static async create_kubernetes_vpn() {

        // --------------
        // the VPN stack
        //---------------

        var params = {
            StackName: "eks-vpn-stack", /* required */
            TemplateURL: KUBERNETES_VPN_STACK,
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

    // this are only needed at the start to configure the project
    SetUpEks.create_kubernetes_iam_role_with_policys()
    SetUpEks.create_kubernetes_vpn()
    console.log("Now wait for the network stack and the IAM stack to deploy")
    console.log(`https://console.aws.amazon.com/cloudformation/home?region=${REGION}#/stacks`)
    
}


module.exports = SetUpEks
