FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose WebSocket port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]