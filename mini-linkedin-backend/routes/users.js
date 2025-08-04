const express = require('express');
const router = express.Router();
const pool = require('../db');

// Optionally add auth middleware if required for private profiles
// const auth = require('../middleware/auth');
// router.get('/:id', auth, async (req, res) => {
router.get('/:id', async (req, res) => {
    const userId = parseInt(req.params.id);

    try {
        const [userRows] = await pool.query('SELECT id, name, email, bio FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = userRows[0];
        const [posts] = await pool.query('SELECT * FROM posts WHERE author_id = ? ORDER BY created_at DESC', [userId]);

        res.json({ user, posts });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
});

module.exports = router;
