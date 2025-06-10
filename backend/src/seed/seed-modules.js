const supabase = require('../config/supabase');

const modules = [
  {
    id: "pencegahan-penyakit",
    title: "Pencegahan Penyakit",
    description: "Pelajari cara mencegah penyakit umum pada kucing melalui vaksinasi, nutrisi yang tepat, dan perawatan rutin yang optimal.",
    icon: "IconHeartFilled",
    color: "from-orange-400 to-orange-600"
  },
  {
    id: "perawatan-dasar",
    title: "Perawatan Dasar",
    description: "Panduan lengkap perawatan dasar kucing dari grooming hingga kebutuhan harian.",
    icon: "IconPaw",
    color: "from-red-400 to-red-600"
  },
  {
    id: "vaksinasi",
    title: "Vaksinasi",
    description: "Informasi lengkap tentang jadwal dan jenis vaksinasi yang diperlukan kucing.",
    icon: "IconVaccine",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: "perilaku",
    title: "Perilaku Kucing",
    description: "Memahami bahasa tubuh dan perilaku kucing untuk komunikasi yang lebih baik.",
    icon: "IconMoodHappy",
    color: "from-green-400 to-green-600"
  },
  {
    id: "nutrisi",
    title: "Nutrisi & Diet",
    description: "Panduan nutrisi dan pola makan sehat untuk kucing.",
    icon: "IconBowl",
    color: "from-purple-400 to-purple-600"
  }
];

async function seedModules() {
  try {
    // Insert modules
    const { error } = await supabase
      .from('education_modules')
      .upsert(modules, { onConflict: 'id' });

    if (error) throw error;

    console.log('Modules seeded successfully');
  } catch (error) {
    console.error('Error seeding modules:', error);
  }
}

seedModules();