const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          email, 
          username, 
          password_hash: passwordHash,
          full_name: username 
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Email or username already exists' });
      }
      throw error;
    }

    // Generate token
    const token = jwt.sign({ userId: data.id }, process.env.JWT_SECRET);

    res.json({ 
      token, 
      user: {
        id: data.id,
        email: data.email,
        username: data.username
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    res.json({ 
      token, 
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

module.exports = router;