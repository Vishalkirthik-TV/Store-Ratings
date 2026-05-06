const express = require('express');
const db = require('../database');
const { authenticateToken, requireRole } = require('../middleware');

const router = express.Router();

router.post('/', authenticateToken, requireRole('user'), async (req, res) => {
    try {
        const { storeId, rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const storeExists = await db.query('SELECT id FROM stores WHERE id = $1', [storeId]);
        if (storeExists.rows.length === 0) {
            return res.status(404).json({ error: 'Store not found' });
        }

        const existingRating = await db.query(
            'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
            [req.user.id, storeId]
        );

        if (existingRating.rows.length > 0) {
            return res.status(400).json({ error: 'You have already rated this store. Use update to modify your rating.' });
        }

        const result = await db.query(
            'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3) RETURNING id, user_id, store_id, rating, created_at',
            [req.user.id, storeId, rating]
        );

        res.status(201).json({
            message: 'Rating submitted successfully',
            rating: result.rows[0]
        });
    } catch (error) {
        console.error('Submit rating error:', error);
        res.status(500).json({ error: 'Server error during rating submission' });
    }
});

router.put('/', authenticateToken, requireRole('user'), async (req, res) => {
    try {
        const { storeId, rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const result = await db.query(
            'UPDATE ratings SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND store_id = $3 RETURNING id, user_id, store_id, rating, updated_at',
            [rating, req.user.id, storeId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Rating not found. Submit a rating first.' });
        }

        res.json({
            message: 'Rating updated successfully',
            rating: result.rows[0]
        });
    } catch (error) {
        console.error('Update rating error:', error);
        res.status(500).json({ error: 'Server error during rating update' });
    }
});

router.get('/my-ratings', authenticateToken, requireRole('user'), async (req, res) => {
    try {
        const result = await db.query(
            `SELECT r.store_id, r.rating, r.created_at, r.updated_at
       FROM ratings r
       WHERE r.user_id = $1`,
            [req.user.id]
        );

        const ratingsMap = {};
        result.rows.forEach(row => {
            ratingsMap[row.store_id] = row.rating;
        });

        res.json(ratingsMap);
    } catch (error) {
        console.error('Get my ratings error:', error);
        res.status(500).json({ error: 'Server error fetching ratings' });
    }
});

module.exports = router;
