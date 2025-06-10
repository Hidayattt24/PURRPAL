const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const supabase = require('../config/supabase');

async function seedModules() {
  try {
    const csvFilePath = path.join(__dirname, 'education-modules.csv');
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

      // Insert modules
      const { error } = await supabase
        .from('education_modules')
        .upsert(records, { onConflict: 'id' });

      if (error) {
        console.error('Error seeding modules:', error);
        return;
      }

      console.log('Modules seeded successfully');
    });
  } catch (error) {
    console.error('Error reading CSV file:', error);
  }
}

seedModules();