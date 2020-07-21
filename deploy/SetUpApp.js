
//constants
const REGION = 'us-east-1'
const EKS_CLUSTER_NODE_STACK = "https://amazon-eks.s3.us-west-2.amazonaws.com/cloudformation/2020-06-10/amazon-eks-nodegroup-role.yaml"
const EKS_NAME = "personal-eks-cluster" 
const APP_NAME = "url-shortener"
const CLUSTER_REPOSITORY_NAME = "eks-image-repository"

var AWS = require('aws-sdk');
const path = require("path")
const fs = require("fs")
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Set the region
AWS.config.update({ region: REGION });

// Create aws services objects
var cloudformation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });


class SetUpApp {

    static async create_eks_docker_repository() {
        //-----------------------------------
        // create the name entry for the app 
        //-----------------------------------
        const command = `\
        aws ecr create-repository \
        --repository-name ${CLUSTER_REPOSITORY_NAME}\
        `

        const { stdout, stderr } = await exec(command);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    }
    
    static async save_ecr_credentials_for_docker() {

        let secrets_file_path = path.resolve(__dirname + "/../credentials/secrets.json")
        let secrets = JSON.parse(fs.readFileSync(secrets_file_path))

        const command = `docker login --username AWS --password-stdin ${secrets.user_id}.dkr.ecr.${REGION}.amazonaws.com`

        const { stdout, stderr } = await exec(command);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    }

    static async build_image() {

        //build the docker locally:
        let secrets_file_path = path.resolve(__dirname + "/../credentials/secrets.json")
        let secrets = JSON.parse(fs.readFileSync(secrets_file_path))

        var command = `docker build -t ${CLUSTER_REPOSITORY_NAME} ..`

        var { stdout, stderr } = await exec(command);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);

        //Tag the compiled dockerfile
        var command = `docker tag eks-image-repository:latest ${secrets.user_id}.dkr.ecr.${REGION}.amazonaws.com/${CLUSTER_REPOSITORY_NAME}:latest`

        var { stdout, stderr } = await exec(command);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    }


    static async push_image() {

        let secrets_file_path = path.resolve(__dirname + "/../credentials/secrets.json")
        let secrets = JSON.parse(fs.readFileSync(secrets_file_path))

        //push the file to the repository:
        const command = `docker push ${secrets.user_id}.dkr.ecr.${REGION}.amazonaws.com/${CLUSTER_REPOSITORY_NAME}:latest`
        const { stdout, stderr } = await exec(command);

        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    }
    
    docker push 282592278669.dkr.ecr.us-east-1.amazonaws.com/eks-image-repository:latest
    

    
    
}

//if the module is main execute the example
if (module === require.main) {
    //SetUpApp.create_eks_docker_repository()
    //SetUpApp.save_ecr_credentials_for_docker()
    //SetUpApp.build_image()
    SetUpApp.push_image()


}

module.exports = SetUpApp
