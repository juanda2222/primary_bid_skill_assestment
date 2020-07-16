
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'REGION'});

class VirtualStorage {

    static get_secrets_file (){
        // this operation is safe to call various times
        await this.client.close();
    }
}

module.exports = Database