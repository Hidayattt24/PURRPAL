const express = require('express');
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Upload profile picture
router.put('/photo', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname);
    const filePath = `avatars/${req.userId}${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('user-content')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-content')
      .getPublicUrl(filePath);

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        avatar_url: publicUrl,
        updated_at: new Date()
      })
      .eq('id', req.userId);

    if (updateError) throw updateError;

    res.json({ 
      message: 'Profile picture updated successfully',
      avatar_url: publicUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, username, full_name, role, location, bio, avatar_url')
      .eq('id', req.userId)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { full_name, role, location, bio } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({ 
        full_name, 
        role, 
        location, 
        bio,
        updated_at: new Date()
      })
      .eq('id', req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get current user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', req.userId)
      .single();

    if (userError) throw userError;

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password_hash: newPasswordHash,
        updated_at: new Date()
      })
      .eq('id', req.userId);

    if (updateError) throw updateError;

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Update email
router.put('/email', authMiddleware, async (req, res) => {
  try {
    const { newEmail, password } = req.body;

    // Verify password
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', req.userId)
      .single();

    if (userError) throw userError;

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }

    // Update email
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        email: newEmail,
        updated_at: new Date()
      })
      .eq('id', req.userId);

    if (updateError) {
      if (updateError.code === '23505') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      throw updateError;
    }

    res.json({ message: 'Email updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update email' });
  }
});

module.exports = router;