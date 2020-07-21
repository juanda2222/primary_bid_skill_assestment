

//----------------------------------------------------------------------------------
// fill this with the network information of the VPN stack created
// stack: https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks
// select: stack_name > Outputs
// replace the network information:
//-----------------------------------------------------------------------------------
const NETWORK_INFO = {
    // the sub networks id:
    subnet1:"subnet-0efebe6362b926787",
    subnet2:"subnet-022a341ba9cb231c8",
    subnet3:"subnet-0232848ff04cf7b53",
    subnet4:"subnet-0cb7f8a59108e7085",
    securityGrups:"sg-0ce9e136cc84a62ca"
}

//----------------------------------------------------------------------------------
// fill this with the network information of the IAM created
// stack: https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks
// select: stack_name > Outputs
// replace with the iam information:
//-----------------------------------------------------------------------------------
const EKS_CLUSTER_ROLE_ARN = `arn:aws:iam::282592278669:role/eks-iam-stack-eksClusterRole-1MEG66RVL8WUZ`

const path = require("path")
const fs = require("fs")
const util = require('util');
const exec = util.promisify(require('child_process').exec);

//constants
const REGION = 'us-east-1'
const EKS_NAME = "personal-eks-cluster" 

class CreateCluster {

    static async create_kubernetes_cluster(){

        const command = `\
        aws eks create-cluster \
        --region ${REGION} \
        --name ${EKS_NAME} \
        --kubernetes-version 1.17 \
        --role-arn ${EKS_CLUSTER_ROLE_ARN} \
        --resources-vpc-config subnetIds=${NETWORK_INFO.subnet1},${NETWORK_INFO.subnet2},${NETWORK_INFO.subnet3},${NETWORK_INFO.subnet4},securityGroupIds=${NETWORK_INFO.securityGrups} \ 
        `

        const { stdout, stderr } = await exec(command);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    }

    static async download_kubeconfig_file(){

        const command = `\
        aws eks --region ${REGION} update-kubeconfig --name ${EKS_NAME}
        `
        const { stdout, stderr } = await exec(command);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    }

    static async cluster_info(){

        const commands = [
            `kubectl get svc`, //List all virtual connections
            `kubectl get services`,    //List all services in the namespace
            `kubectl get pods`, // List all pods in the namespace
            `kubectl get pods --all-namespaces` //List all pods in all namespaces
        ]

        commands.forEach( async (command) => {
            var { stdout, stderr } = await exec(command);
            console.log('stdout: \n', stdout);
            console.error('stderr: \n', stderr);
            console.error('------- COMMAND END -------');
        });
    }

    
}

//if the module is main execute the example
if (module === require.main) {

    // this should be excexcuted after SetUpEks.js
    CreateCluster.create_kubernetes_cluster()
    CreateCluster.download_kubeconfig_file()
    CreateCluster.cluster_info()
    console.log("Now ceate a ssh key pair to connect to your nodes (you have to create it manually)")
    console.log("Go here to create the key pair (you might need to adjust the url)")
    console.log(`https://console.aws.amazon.com/ec2/home?region=${REGION}#KeyPairs:`)
    

}


module.exports = CreateCluster
