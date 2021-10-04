FROM node:14.17.0-slim as dev


# Create app directory
WORKDIR /usr/src/app

# Install app dependencies (package.json and package-lock.json)
COPY package*.json ./
RUN npm install

# Bundle app source (server.js)
COPY . .

# Listen port
EXPOSE 8080

# Run Node.js
CMD [ "npm", "run", "start" ]


FROM node:14.17.0-slim as prod

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies (package.json and package-lock.json)
COPY package*.json ./

RUN npm install

# Bundle app source (server.js)
COPY . .

RUN npm run build

# Listen port
EXPOSE 8080

# Run Node.js
CMD [ "npm", "run", "start:prod" ]