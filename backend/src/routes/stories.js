const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

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
      recipient: story.recipient,
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
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Create story
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { recipient, content, location, activity_image_url } = req.body;
    
    const { data, error } = await supabase
      .from('stories')
      .insert([
        {
          user_id: req.userId,
          recipient,
          content,
          location_name: location?.name,
          location_address: location?.address,
          activity_image_url
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

module.exports = router;