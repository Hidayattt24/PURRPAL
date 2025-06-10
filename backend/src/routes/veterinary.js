const express = require('express');
const supabase = require('../config/supabase');

const router = express.Router();

// Get veterinary services with optional city filter
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    
    let query = supabase.from('veterinary_services').select('*');
    
    if (city) {
      query = query.ilike('address', `%${city}%`);
    }
    
    const { data, error } = await query;

    if (error) throw error;

    // Format position from POINT to array
    const formattedData = data.map(service => ({
      ...service,
      position: service.position ? 
        [service.position.x, service.position.y] : 
        [0, 0]
    }));

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch veterinary services' });
  }
});

module.exports = router;