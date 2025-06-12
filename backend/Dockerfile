# Stage 1: Git operations
FROM alpine/git:latest as git-stage

WORKDIR /repo

# Copy git configuration
COPY .git .git
COPY .gitmodules .gitmodules

# Clone submodules
RUN git submodule update --init --recursive --depth 1

# Stage 2: Application build
FROM node:18-alpine as app-stage

WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Copy submodules from git stage
COPY --from=git-stage /repo/chatbot ./chatbot

# Verify files
RUN echo "📁 Verifying chatbot files:" && \
    ls -la chatbot/ && \
    if [ -f chatbot/src/chatbot.js ]; then \
        echo "✅ Chatbot source verified"; \
    else \
        echo "❌ Chatbot source missing"; \
        exit 1; \
    fi

# Expose port
EXPOSE 8080

# Start application
CMD ["npm", "start"]