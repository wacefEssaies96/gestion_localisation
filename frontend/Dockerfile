# Dockerfile for React client

# Build react client
FROM node:16.17.0

# Working directory be app
WORKDIR /usr/src/app

COPY package*.json ./

###  Installing dependencies

RUN yarn

# copy local files to app folder
COPY . .

EXPOSE 3000

CMD ["yarn","start"]