const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get all stories
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        user:users!user_id (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format data to match frontend
    const formattedStories = data.map(story => ({
      id: story.id,
      from: story.user.username,
      content: story.content,
      image: story.user.avatar_url || '/main/home/placeholder-avatar.jpg',
      activityImage: story.activity_image_url,
      location: story.location_name ? {
        name: story.location_name,
        address: story.location_address
      } : null,
      created_at: story.created_at
    }));

    res.json(formattedStories);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories', details: error.message });
  }
});

// Create story with photo upload
router.post('/', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    console.log('Creating story with data:', {
      userId: req.userId,
      content: req.body.content,
      hasPhoto: !!req.file,
      hasLocation: !!req.body.location
    });

    if (!req.body.content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    let activity_image_url = null;

    // Upload photo if provided
    if (req.file) {
      try {
        const timestamp = Date.now();
        const fileExt = path.extname(req.file.originalname);
        const filePath = `story-photos/${req.userId}-${timestamp}${fileExt}`;

        console.log('Uploading photo to path:', filePath);

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('user-content')
          .upload(filePath, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false
          });

        if (uploadError) {
          console.error('Photo upload error:', uploadError);
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('user-content')
          .getPublicUrl(filePath);

        activity_image_url = publicUrl;
        console.log('Photo uploaded successfully:', activity_image_url);
      } catch (uploadError) {
        console.error('Error uploading photo:', uploadError);
        return res.status(500).json({ error: 'Failed to upload photo', details: uploadError.message });
      }
    }

    // Parse location if provided
    let location = null;
    if (req.body.location) {
      try {
        location = JSON.parse(req.body.location);
      } catch (parseError) {
        console.error('Error parsing location:', parseError);
        return res.status(400).json({ error: 'Invalid location format', details: parseError.message });
      }
    }

    // Create story
    const { data, error } = await supabase
      .from('stories')
      .insert([
        {
          user_id: req.userId,
          content: req.body.content,
          location_name: location?.name,
          location_address: location?.address,
          activity_image_url
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error inserting story:', error);
      throw error;
    }

    console.log('Story created successfully:', data);
    res.json(data);
  } catch (error) {
    console.error('Error in story creation:', error);
    res.status(500).json({ 
      error: 'Failed to create story', 
      details: error.message,
      code: error.code 
    });
  }
});

module.exports = router;