const express = require('express');
const router = express.Router();

// Proxy endpoint for reverse geocoding
router.get('/reverse-geocode', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          'User-Agent': 'PurrPal/1.0' // Required by Nominatim's usage policy
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({ error: 'Failed to get location data' });
  }
});

module.exports = router; 