const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth'); // JWT auth middleware to protect routes
const router = express.Router();

// Send connection request
router.post('/request/:receiverId', auth, async (req, res) => {
    const requesterId = req.user.id;
    const receiverId = parseInt(req.params.receiverId);

    if (requesterId === receiverId) {
        return res.status(400).json({ message: "You cannot connect to yourself." });
    }

    try {
        // Check if connection or request already exists (in any direction)
        const [existing] = await pool.query(
            `SELECT * FROM connections WHERE 
        (requester_id = ? AND receiver_id = ?) OR 
        (requester_id = ? AND receiver_id = ?)`,
            [requesterId, receiverId, receiverId, requesterId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Connection or request already exists." });
        }

        // Insert new connection request as pending
        await pool.query(
            'INSERT INTO connections (requester_id, receiver_id) VALUES (?, ?)',
            [requesterId, receiverId]
        );

        res.json({ message: 'Connection request sent.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error sending connection request.' });
    }
});

// Get incoming connection requests for current user

// Accept a connection request
router.post('/accept/:connectionId', auth, async (req, res) => {
    const userId = req.user.id;
    const connectionId = parseInt(req.params.connectionId);

    try {
        const [result] = await pool.query(
            `UPDATE connections SET status = 'accepted' 
       WHERE id = ? AND receiver_id = ? AND status = 'pending'`,
            [connectionId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Connection request not found or already handled.' });
        }

        res.json({ message: 'Connection request accepted.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error accepting connection request.' });
    }
});

// Decline a connection request
router.post('/decline/:connectionId', auth, async (req, res) => {
    const userId = req.user.id;
    const connectionId = parseInt(req.params.connectionId);

    try {
        const [result] = await pool.query(
            `UPDATE connections SET status = 'declined' 
       WHERE id = ? AND receiver_id = ? AND status = 'pending'`,
            [connectionId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Connection request not found or already handled.' });
        }

        res.json({ message: 'Connection request declined.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error declining connection request.' });
    }
    router.get('/requests', auth, async (req, res) => {
        const userId = req.user.id;

        try {
            const [requests] = await pool.query(
                `SELECT c.id as connectionId, u.id as userId, u.name, u.email, u.bio 
       FROM connections c
       JOIN users u ON c.requester_id = u.id
       WHERE c.receiver_id = ? AND c.status = 'pending'`,
                [userId]
            );

            res.json(requests);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error loading connection requests.' });
        }
    });

});

module.exports = router;
