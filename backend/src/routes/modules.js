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

    res.json(data);
  } catch (error) {
    console.error(error);
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
      sections
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
});

module.exports = router;