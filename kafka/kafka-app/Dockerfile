# Use the Node.js LTS Alpine image as the base image
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the application files into the container
COPY . /app

# Install application dependencies
RUN npm install

# Specify the command to run your application
# CMD ["node", "topic.ts"]s
