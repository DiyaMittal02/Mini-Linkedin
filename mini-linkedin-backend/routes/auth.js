const express = require('express');
const pool = require('../db');           // your MySQL connection pool
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
    const { name, email, password, bio } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    try {
        // Check if email already exists
        const [existingUsers] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert new user into DB
        await pool.query(
            'INSERT INTO users (name, email, password_hash, bio) VALUES (?, ?, ?, ?)',
            [name, email, password_hash, bio || '']
        );

        res.json({ message: 'Registration successful.' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Check if user exists
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const user = users[0];

        // Compare password hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Create JWT payload and sign token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
    // Search users by name or email
router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  if (!q) return res.json({ results: [] });
  const [results] = await pool.query(
    `SELECT id, name, email, bio FROM users 
     WHERE name LIKE ? OR email LIKE ? LIMIT 20`,
    [`%${q}%`, `%${q}%`]
  );
  res.json({ results });
});

});

module.exports = router;
