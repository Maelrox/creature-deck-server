# Use the official Node.js image as the base image
FROM node:21

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the SSL certificate and key
COPY cert.pem key.pem /usr/src/app/

# Expose the port the app runs on
EXPOSE 3300

# Command to run the application
CMD ["node", "src/server.js"]