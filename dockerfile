# official Node.js image as a base
FROM node:14

# create and change to the app directory
WORKDIR /usr/src/app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy rest of application code
COPY . .

# port app runs on
EXPOSE 3000

# command defined to run the app
CMD ["node", "app.js"]