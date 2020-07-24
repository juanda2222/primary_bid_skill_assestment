
//constants
const REGION = 'us-east-1'
const CLUSTER_REPOSITORY_NAME = "eks-image-repository"

var AWS = require('AwsCli');
const path = require("path")
const fs = require("fs")
const util = require('util');
const { spawn, exec } = require('child_process');
const promise_exec = util.promisify(exec);

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

        const { stdout, stderr } = await promise_exec(command);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    }
    
    static async save_ecr_credentials_for_docker() {

        let secrets_file_path = path.resolve(__dirname + "/../credentials/secrets.json")
        let secrets = JSON.parse(fs.readFileSync(secrets_file_path))

        const command = `docker login --username AWS --password-stdin ${secrets.user_id}.dkr.ecr.${REGION}.amazonaws.com`

        const { stdout, stderr } = await promise_exec(command);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    }
   
}

//if the module is main execute the example
if (module === require.main) {
    SetUpApp.create_eks_docker_repository()
    SetUpApp.save_ecr_credentials_for_docker()
}

module.exports = SetUpApp
