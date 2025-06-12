FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code (including chatbot submodule)
COPY . .

# Expose port for Cloud Run
EXPOSE 8080

# Start the application
CMD ["npm", "start"]