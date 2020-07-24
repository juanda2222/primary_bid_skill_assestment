# Express, Vue, Mongo and Aws fullstack url shortener

This is a template for a fullstack application using Express, Vue, Mongo and Aws. A running example is deployed in Aws but you can use it locally. Feel free to use the code and create a issue if you are having problems. 


https://www.youtube.com/watch?v=fmFlAWtKnGA

## Local quickstart

To test the applicattion localy set up the following tools:
> node -version >= v12
> yarn -version >= 1.2
> Mongo Altasian account with your local ip whitelisted [here](https://cloud.mongodb.com/)
> A credentials folder on the root project with the following format:
```json
{
  "db_user":"your mongod DATABASE user", //diferent from the credentials to acces the cloud.mongo page
  "db_password":"your mongodb DATABASE password",
  "user_id":"Your aws iam user number. Ej: 394372858669" //This is OPTIONAL if you only want to deploy localy
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

```bash

# Install dependencies
yarn add all

# Start Express Server: http://localhost:5000
# And vue Server: http://localhost:8080
yarn dev_lin | yarn dev_win

# go to http://localhost:8080 to use the app
```


## App Info

> Create a Kubernetes cluster from aws console: https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html
> Create a Kubernetes cluster from aws console: https://docs.aws.amazon.com/eks/latest/userguide/getting-started-console.html


### Author

Juan David Ramirez
[Portfolio](https://david.alfagenos.com)

### Version

1.0.0

### License

This project is licensed under the MIT License

