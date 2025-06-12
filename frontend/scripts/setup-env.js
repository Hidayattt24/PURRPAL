const fs = require('fs');
const path = require('path');

// Define the environment variables
const envContent = `# Environment variables for the frontend application

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDA72Ut_hqVgFT7N8Vso6239u5xauVuIHg

# Backend API URL
NEXT_PUBLIC_API_URL=https://purrpal-backend-817826973206.asia-southeast2.run.app/api

# Supabase untuk frontend auth
NEXT_PUBLIC_SUPABASE_URL=https://dalbccgmacradpgwvmxm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGJjY2dtYWNyYWRwZ3d2bXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzM0NzQsImV4cCI6MjA2NTE0OTQ3NH0.iw8w2vu9XYB92KsP4YcsssR6R7V3rYBJG9_VXCLCsLU
`;

// Write to .env.local
fs.writeFileSync(path.join(__dirname, '..', '.env.local'), envContent);
console.log('✅ Created .env.local file');

// Create env-config.js for runtime configuration
const publicEnvContent = `window.__ENV__ = {
  NEXT_PUBLIC_API_URL: 'https://purrpal-backend-817826973206.asia-southeast2.run.app/api',
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'AIzaSyDA72Ut_hqVgFT7N8Vso6239u5xauVuIHg',
  NEXT_PUBLIC_SUPABASE_URL: 'https://dalbccgmacradpgwvmxm.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhbGJjY2dtYWNyYWRwZ3d2bXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzM0NzQsImV4cCI6MjA2NTE0OTQ3NH0.iw8w2vu9XYB92KsP4YcsssR6R7V3rYBJG9_VXCLCsLU'
};`;

// Ensure public directory exists
if (!fs.existsSync(path.join(__dirname, '..', 'public'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'public'));
}

// Write to public/env-config.js
fs.writeFileSync(path.join(__dirname, '..', 'public', 'env-config.js'), publicEnvContent);
console.log('✅ Created public/env-config.js file'); 