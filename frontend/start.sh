#!/bin/sh
# frontend/start.sh - Runtime environment injection script

echo "🚀 Starting PurrPal Frontend with runtime environment injection..."

# Debug: Print available environment variables
echo "=== AVAILABLE ENVIRONMENT VARIABLES ==="
echo "NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}"
echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: ${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:+SET}"
echo "NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:+SET}"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:+SET}"
echo "========================================="

# Create runtime environment configuration file
echo "📝 Creating runtime environment configuration..."
cat > /app/public/env-config.js << EOF
// Runtime environment configuration
// Generated at container startup: $(date)
window.__ENV__ = {
  NEXT_PUBLIC_API_URL: '${NEXT_PUBLIC_API_URL}',
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: '${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}',
  NEXT_PUBLIC_SUPABASE_URL: '${NEXT_PUBLIC_SUPABASE_URL}',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: '${NEXT_PUBLIC_SUPABASE_ANON_KEY}',
};

// Debug logging
console.log('🌍 Runtime environment configuration loaded');
console.log('📍 API URL:', window.__ENV__.NEXT_PUBLIC_API_URL);
console.log('🗺️ Google Maps API:', window.__ENV__.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'CONFIGURED' : 'NOT SET');
console.log('🔐 Supabase URL:', window.__ENV__.NEXT_PUBLIC_SUPABASE_URL ? 'CONFIGURED' : 'NOT SET');
console.log('🔑 Supabase Key:', window.__ENV__.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'CONFIGURED' : 'NOT SET');

// Expose for debugging in development
if (window.location.hostname === 'localhost') {
  window.__DEBUG_ENV__ = window.__ENV__;
  console.log('🛠️ Debug mode: Environment variables available at window.__DEBUG_ENV__');
}
EOF

echo "✅ Runtime environment configuration created at /app/public/env-config.js"

# Verify the file was created
if [ -f "/app/public/env-config.js" ]; then
    echo "📄 Configuration file size: $(wc -c < /app/public/env-config.js) bytes"
else
    echo "❌ Failed to create configuration file!"
    exit 1
fi

# Start the Next.js application
echo "🏃 Starting Next.js server..."
exec node server.js