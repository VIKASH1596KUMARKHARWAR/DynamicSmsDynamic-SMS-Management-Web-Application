# Use the official Node.js image
FROM node:18.20.4 AS build

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies using npm ci for better reproducibility
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the frontend application
RUN npm run build

# Use a lighter image for serving the frontend build
FROM node:18.20.4 AS production

# Set the working directory for the production stage
WORKDIR /usr/src/app

# Copy the built frontend files from the build stage
COPY --from=build /usr/src/app/build ./build

# Install serve to serve the frontend build
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build"]
