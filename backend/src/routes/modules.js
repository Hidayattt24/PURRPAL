const express = require('express');
const supabase = require('../config/supabase');

const router = express.Router();

// Get all modules
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('education_modules')
      .select('*')
      .order('created_at');

    if (error) throw error;

    // Transform data to match frontend format
    const formattedModules = data.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description,
      icon: module.icon,
      color: module.color
    }));

    res.json(formattedModules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// Get module with sections
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: module, error: moduleError } = await supabase
      .from('education_modules')
      .select('*')
      .eq('id', id)
      .single();

    if (moduleError) throw moduleError;

    const { data: sections, error: sectionsError } = await supabase
      .from('module_sections')
      .select('*')
      .eq('module_id', id)
      .order('order_index');

    if (sectionsError) throw sectionsError;

    res.json({
      ...module,
      sections: sections || []
    });
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
});

module.exports = router;