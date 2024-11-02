# Use the official Node.js image
FROM node:18.20.4

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies using npm ci for better reproducibility
RUN npm ci

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Health check (optional)
HEALTHCHECK CMD curl --fail http://localhost:5000/ || exit 1

# Start the application
CMD ["node", "server.js"]
