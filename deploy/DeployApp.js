
//constants
const REGION = 'us-east-1'
const CLUSTER_REPOSITORY_NAME = "eks-image-repository"

const path = require("path")
const fs = require("fs")
const util = require('util');
const { spawn, exec } = require('child_process');
const promise_exec = util.promisify(exec);



class DeployApp {

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

    DeployApp.build_image()
    DeployApp.push_image()
}

module.exports = DeployApp
