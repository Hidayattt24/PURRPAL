const supabase = require('./supabase');

async function setupStorage() {
  try {
    // Create the user-content bucket if it doesn't exist
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) throw bucketsError;

    const bucketExists = buckets.some(bucket => bucket.name === 'user-content');

    if (!bucketExists) {
      const { error: createError } = await supabase
        .storage
        .createBucket('user-content', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB in bytes
        });

      if (createError) throw createError;
      console.log('Created user-content bucket successfully');
    } else {
      console.log('user-content bucket already exists');
    }

    // Update bucket to be public
    const { error: updateError } = await supabase
      .storage
      .updateBucket('user-content', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB in bytes
      });

    if (updateError) throw updateError;
    console.log('Updated user-content bucket settings successfully');

  } catch (error) {
    console.error('Error setting up storage:', error);
  }
}

setupStorage(); 