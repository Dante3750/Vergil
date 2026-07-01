FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Ensure the data folder for XP persistence exists
RUN mkdir -p data

# Run with keepalive for 24/7 uptime
CMD [ "npm", "run", "live" ]