const supabase = require('../config/supabase');
const veterinaryServices = require('./veterinaryData'); // Copy dari file frontend

async function seedVeterinary() {
  try {
    // Format data untuk PostgreSQL POINT type
    const formattedServices = veterinaryServices.map(service => ({
      ...service,
      position: `(${service.position[0]},${service.position[1]})`
    }));

    const { error } = await supabase
      .from('veterinary_services')
      .upsert(formattedServices, { onConflict: 'id' });

    if (error) throw error;

    console.log('Veterinary services seeded successfully');
  } catch (error) {
    console.error('Error seeding veterinary services:', error);
  }
}

seedVeterinary();