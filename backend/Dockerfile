FROM node:18-alpine

WORKDIR /app

# Install git and other necessary tools
RUN apk add --no-cache git openssh-client

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source (this includes .gitmodules)
COPY . .

# Configure git for submodule operations
RUN git config --global user.email "build@purrpal.com" && \
    git config --global user.name "PurrPal Build"

# Initialize and update submodules
# The --recursive flag handles nested submodules
# The --depth 1 flag makes it faster by doing shallow clone
RUN if [ -f .gitmodules ]; then \
        echo "📦 Initializing git submodules..." && \
        git submodule update --init --recursive --depth 1 && \
        echo "✅ Submodules initialized successfully" && \
        ls -la chatbot/ && \
        echo "📁 Chatbot contents:" && \
        find chatbot/ -type f -name "*.js" | head -10; \
    else \
        echo "⚠️ No .gitmodules file found"; \
    fi

# Verify chatbot files exist
RUN if [ -f chatbot/src/chatbot.js ]; then \
        echo "✅ Chatbot source found"; \
    else \
        echo "❌ Chatbot source not found, listing chatbot directory:" && \
        ls -la chatbot/ || echo "Chatbot directory does not exist"; \
    fi

# Expose port for Cloud Run
EXPOSE 8080

# Start the application
CMD ["npm", "start"]