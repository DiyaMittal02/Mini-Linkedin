const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth'); // Your JWT middleware
const router = express.Router();

// Create a new post
router.post('/', auth, async (req, res) => {
    const userId = req.user.id; // grabbed from JWT token via auth middleware
    const { content } = req.body;

    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Post content cannot be empty.' });
    }

    try {
        await pool.query(
            'INSERT INTO posts (author_id, content) VALUES (?, ?)',
            [userId, content]
        );
        res.json({ message: 'Post created successfully.' });
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ message: 'Server error creating post.' });
    }
});

// Get all posts for the feed (with author info)
router.get('/', async (req, res) => {
    try {
        const [posts] = await pool.query(
            `SELECT p.id, p.content, p.created_at, u.id as author_id, u.name
       FROM posts p
       JOIN users u ON p.author_id = u.id
       ORDER BY p.created_at DESC`
        );
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Server error fetching posts.' });
    }
});

// Optional: Get posts by a specific user (profile)
router.get('/user/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        const [posts] = await pool.query(
            `SELECT id, content, created_at FROM posts 
       WHERE author_id = ? ORDER BY created_at DESC`,
            [userId]
        );
        res.json(posts);
    } catch (err) {
        console.error('Error fetching user posts:', err);
        res.status(500).json({ message: 'Server error fetching user posts.' });
    }
});

module.exports = router;
