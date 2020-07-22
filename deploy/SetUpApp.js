
//constants
const REGION = 'us-east-1'
const CLUSTER_REPOSITORY_NAME = "eks-image-repository"

var AWS = require('aws-sdk');
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

    static async build_image() {

        //build the docker locally:
        let secrets_file_path = path.resolve(__dirname + "/../credentials/secrets.json")
        let secrets = JSON.parse(fs.readFileSync(secrets_file_path))

        var command = (`docker build -t ${CLUSTER_REPOSITORY_NAME} ..`).split(" ")
        const child = spawn(command[0], command.slice(1, command.length));

        // this is a time expensive command so we use this format to print the progress
        await new Promise((fulfill, reject) => {
            child.stdout.on('data', (data) => {
                console.log(`child stdout:\n${data}`);
            });
            
            child.stderr.on('data', (data) => {
                console.error(`child stderr:\n${data}`);
                reject(data)
            });

            child.on('exit', function (code, signal) {
                console.log('child process exited with ' +
                            `code ${code} and signal ${signal}`);
                fulfill(code)
            });
        })
        


        //Tag the compiled dockerfile
        var command = (`docker tag eks-image-repository:latest ${secrets.user_id}.dkr.ecr.${REGION}.amazonaws.com/${CLUSTER_REPOSITORY_NAME}:latest`).split(" ")
        const child = spawn(command[0], command.slice(1, command.length));

        // this one is time exprensive too
        await new Promise((fulfill, reject) => {
            child.stdout.on('data', (data) => {
                console.log(`child stdout:\n${data}`);
            });
            
            child.stderr.on('data', (data) => {
                console.error(`child stderr:\n${data}`);
                reject(data)
            });

            child.on('exit', function (code, signal) {
                console.log('child process exited with ' +
                            `code ${code} and signal ${signal}`);
                fulfill(code)
            });
        })
    }


    static async push_image() {

        let secrets_file_path = path.resolve(__dirname + "/../credentials/secrets.json")
        let secrets = JSON.parse(fs.readFileSync(secrets_file_path))

        //push the file to the repository:
        const command = `docker push ${secrets.user_id}.dkr.ecr.${REGION}.amazonaws.com/${CLUSTER_REPOSITORY_NAME}:latest`
        const { stdout, stderr } = await promise_exec(command);

        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    }
    
    
}

//if the module is main execute the example
if (module === require.main) {
    //SetUpApp.create_eks_docker_repository()
    //SetUpApp.save_ecr_credentials_for_docker()
    SetUpApp.build_image()
    //SetUpApp.push_image()


}

module.exports = SetUpApp
