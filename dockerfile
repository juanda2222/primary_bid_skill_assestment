# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:12-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# set up the enviroment vars:
ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80/tcp

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.

# Copy local code to the container image.
COPY ./package*.json ./
COPY ./build/ ./build/

RUN yarn add all --production

# Run the web service on container startup.
CMD [ "yarn", "start" ]