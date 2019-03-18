FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Copy package json and install files
COPY package*.json ./
RUN npm install

# copy the application code 
COPY . .

EXPOSE 3000
