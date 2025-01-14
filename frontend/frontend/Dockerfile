# Use official Node.js image as a base
FROM node:16

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json /app/
RUN npm install

# Copy the rest of the application
COPY . /app/

# Build the React app
RUN npm run build

# Serve the app using a simple server
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

EXPOSE 3000
