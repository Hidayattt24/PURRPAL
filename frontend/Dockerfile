FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code and build
COPY . .

# Build the application (environment variables will be injected at runtime)
RUN npm run build

# Debug: Show build output
RUN echo "=== BUILD COMPLETED ===" && \
    ls -la .next/ && \
    echo "Build directory size: $(du -sh .next/)" && \
    echo "======================="

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

# Install bash (needed for start.sh script)
RUN apk add --no-cache bash curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy startup script
COPY start.sh ./start.sh

# Make script executable and set ownership
RUN chmod +x ./start.sh && \
    chown nextjs:nodejs ./start.sh && \
    # Ensure public directory is writable for env-config.js
    chown -R nextjs:nodejs ./public

# Debug: Verify files are in place
RUN echo "=== RUNTIME SETUP VERIFICATION ===" && \
    ls -la ./start.sh && \
    ls -la ./public/ && \
    echo "=================================="

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Use startup script instead of direct node command
CMD ["./start.sh"]