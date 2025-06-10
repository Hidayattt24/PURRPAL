const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const supabase = require('../config/supabase');

async function seedModuleSections() {
  try {
    const csvFilePath = path.join(__dirname, 'module-sections.csv');
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

    // Parse CSV
    parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    }, async (err, records) => {
      if (err) {
        console.error('Error parsing CSV:', err);
        return;
      }

      // Transform records
      const sections = records.map(record => ({
        module_id: record.module_id,
        title: record.title,
        description: record.description,
        icon: record.icon,
        color: record.color,
        highlights: record.highlights.split(','),
        order_index: parseInt(record.order_index)
      }));

      // Insert sections
      const { error } = await supabase
        .from('module_sections')
        .upsert(sections, { onConflict: 'module_id,order_index' });

      if (error) {
        console.error('Error seeding module sections:', error);
        return;
      }

      console.log('Module sections seeded successfully');
    });
  } catch (error) {
    console.error('Error reading CSV file:', error);
  }
}

seedModuleSections(); 