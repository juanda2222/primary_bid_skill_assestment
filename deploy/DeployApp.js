
//constants
const REGION = 'us-east-1'
const NAMESPACE_NAME = "url-shortener-namespace"

var AWS = require('aws-sdk');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Set the region
AWS.config.update({ region: REGION });

// Create aws services objects
var cloudformation = new AWS.CloudFormation({ apiVersion: '2010-05-15' });


class CreateApp {

    static async deploy_image() {

        // create the name entry for the app
        const command = `kubectl apply -f ../url_service.yaml`
        const { stdout, stderr } = await exec(command);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    }
    
}

//if the module is main execute the example
if (module === require.main) {
    CreateApp.create_namespace()
    CreateApp.deploy_image()

}

module.exports = CreateNodeGroup
