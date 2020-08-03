# Express, Vue, Mongo and Aws fullstack url shortener

![Recordit GIF](http://g.recordit.co/iRRnSTyLmI.gif)

This is a template for a fullstack application using Express, Vue, Mongo and Aws. A running example is deployed in Aws but you can use it locally. Feel free to use the code and create a issue if you are having problems. 
Live demo: [load balancer](ec2co-ecsel-xjcuiqrb42di-1967177933.us-east-1.elb.amazonaws.com) [Container instance](http://34.205.141.209/) 

## Local quickstart

To test the applicattion localy set up the following tools:
> node -version >= v12
> yarn -version >= 1.2
> Mongo Altasian account with your local ip whitelisted [here](https://cloud.mongodb.com/)
> A credentials folder on the root project with the following format:
```json
{
  "db_user":"your mongod DATABASE user (diferent from the credentials to acces the cloud.mongo page)",
  "db_password":"your mongodb DATABASE password",
  "user_id":"Your aws iam user number. Ej: 394372858669 (This is OPTIONAL if you just want to deploy locally)"
}
```
> Run the local enviroment:
```bash

# Install dependencies
yarn add all

# Start Express Server: http://localhost:5000
# And vue Server: http://localhost:8080
yarn dev

# go to http://localhost:8080 to use the app
```

## AWS Set up

To set up your aws enviroment you need to have:

> Aws client tool --> latest (Authenticated)
> Docker tools --> latest
> Create a Kubernetes cluster from aws console: https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html

```bash

# Set up a stack in the cloud with:
node ./deploy/SetUpEcs.js

###########################################################
##          check the progress of your stack here:       ##
##     https://console.aws.amazon.com/cloudformation/    ##
##  don't run the next command until the stack is done   ##
###########################################################

# Prepare your docker credentials
node ./deploy/SetUpApp.js
```

## Publish new version

```bash

# build the front static files and the backend js from typescript
yarn build

# build ad publish to the aws repo
node ./deploy/DeployApp.js
```

### About the App

Keep it responsive!
![Recordit GIF](http://g.recordit.co/zh07F8Lx1B.gif)


### Author

Juan David Ramirez
[Portfolio](https://david.alfagenos.com)
You can always donate me [here](https://david.alfagenos.com/donate)

### Version

1.0.0

### License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2015 © <a href="http://fvcproductions.com" target="_blank">FVCproductions</a>.