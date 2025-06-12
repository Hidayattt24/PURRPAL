FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Simple verification that chatbot exists
RUN if [ -f chatbot/src/chatbot.js ]; then \
        echo "✅ Chatbot source verified"; \
    else \
        echo "❌ Chatbot source missing"; \
        ls -la chatbot/ || echo "No chatbot directory"; \
        exit 1; \
    fi

# Expose port
EXPOSE 8080

# Start application
CMD ["npm", "start"]