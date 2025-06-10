-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(100) DEFAULT 'UX | Product Designer',
  location VARCHAR(255) DEFAULT 'Indonesia',
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Stories table
CREATE TABLE stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  location_name VARCHAR(255),
  location_address TEXT,
  activity_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Education modules (static content)
CREATE TABLE education_modules (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Module sections
CREATE TABLE module_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  module_id VARCHAR(100) REFERENCES education_modules(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(100),
  highlights TEXT[], -- Array of highlights
  order_index INTEGER DEFAULT 0,
  UNIQUE (module_id, title)
);

-- Veterinary services (from your data)
CREATE TABLE veterinary_services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50),
  rating DECIMAL(2,1),
  total_reviews INTEGER DEFAULT 0,
  open_hours VARCHAR(100),
  services TEXT[],
  position POINT, -- PostgreSQL point type for lat/lng
  google_map_url TEXT
);