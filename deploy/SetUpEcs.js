

var path = require("path")
var fs = require('fs');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

//constants
const REGION = 'us-east-1'


// Set the region
AWS.config.update({ region: REGION });

// Create aws services objects
var cloudformation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });


class SetUpEks {

    static async create_ecs_stack() {

        // --------------
        // the Ecs stack
        //---------------

        let cluster_stack_path = path.resolve(__dirname + "/cluster_stack.yaml")
        let serialized_iam_stack_description = fs.readFileSync(cluster_stack_path).toString()

        var params = {
            StackName: "ecs-cluster-stack", /* required */
            TemplateBody: serialized_iam_stack_description,
            //TimeoutInMinutes: '30', //time before the stack creation fails
            Parameters: [
                {
                    ParameterKey: "AsgMaxSize",
                    ParameterValue: "1"
                }, {
                    ParameterKey: "CreateElasticLoadBalancer",
                    ParameterValue: "false"
                }, {
                    ParameterKey: "EcsAmiId",
                    ParameterValue: "ami-0d09143c6fc181fe3"
                }, {
                    ParameterKey: "EcsClusterName",
                    ParameterValue: "personal-cluster"
                }, {
                    ParameterKey: "EcsEndpoint",
                    ParameterValue: "-"
                }, {
                    ParameterKey: "EcsInstanceType",
                    ParameterValue: "t2.micro"
                }, {
                    ParameterKey: "EcsPort",
                    ParameterValue: "80"
                }, {
                    ParameterKey: "ElbHealthCheckTarget",
                    ParameterValue: "HTTP:80/"
                }, {
                    ParameterKey: "ElbPort",
                    ParameterValue: "80"
                }, {
                    ParameterKey: "IamRoleInstanceProfile",
                    ParameterValue: "ecsInstanceRole"
                }, {
                    ParameterKey: "IsFargate",
                    ParameterValue: "true"
                }, {
                    ParameterKey: "KeyName",
                    ParameterValue: "-"
                }, {
                    ParameterKey: "SourceCidr",
                    ParameterValue: "0.0.0.0/0"
                }, {
                    ParameterKey: "SubnetCidrBlock1",
                    ParameterValue: "10.0.0.0/24"
                }, {
                    ParameterKey: "SubnetCidrBlock2",
                    ParameterValue: "10.0.1.0/24"
                }, {
                    ParameterKey: "TargetGroupName",
                    ParameterValue: "ECSFirstRunTargetGroup"
                }, {
                    ParameterKey: "TargetType",
                    ParameterValue: "ip"
                }, {
                    ParameterKey: "VpcAvailabilityZones",
                    ParameterValue: "us-east-1a,us-east-1b,us-east-1c,us-east-1d,us-east-1e,us-east-1f"
                }, {
                    ParameterKey: "VpcCidrBlock",
                    ParameterValue: "10.0.0.0/16"
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
    SetUpEks.create_ecs_stack()
    console.log("Now wait for the network stack to deploy")
    console.log(`https://console.aws.amazon.com/cloudformation/home?region=${REGION}#/stacks`)
    
}


module.exports = SetUpEks
