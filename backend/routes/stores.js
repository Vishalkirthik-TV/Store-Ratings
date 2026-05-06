const express = require('express');
const db = require('../database');
const { authenticateToken, requireRole } = require('../middleware');

const router = express.Router();

router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const { name, email, address, ownerId } = req.body;

        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({ error: 'Name must be between 20 and 60 characters' });
        }

        if (!address || address.length > 400) {
            return res.status(400).json({ error: 'Address must not exceed 400 characters' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const existingStore = await db.query('SELECT id FROM stores WHERE email = $1', [email]);
        if (existingStore.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        if (ownerId) {
            const owner = await db.query('SELECT id, role FROM users WHERE id = $1', [ownerId]);
            if (owner.rows.length === 0) {
                return res.status(400).json({ error: 'Owner not found' });
            }

            const result = await db.query(
                'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, address, owner_id',
                [name, email, address, ownerId]
            );

            await db.query('UPDATE users SET role = $1, store_id = $2 WHERE id = $3', ['store_owner', result.rows[0].id, ownerId]);

            res.status(201).json({
                message: 'Store created successfully',
                store: result.rows[0]
            });
        } else {
            const result = await db.query(
                'INSERT INTO stores (name, email, address) VALUES ($1, $2, $3) RETURNING id, name, email, address',
                [name, email, address]
            );

            res.status(201).json({
                message: 'Store created successfully',
                store: result.rows[0]
            });
        }
    } catch (error) {
        console.error('Store creation error:', error);
        res.status(500).json({ error: 'Server error during store creation' });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const { name, address, sortBy, sortOrder } = req.query;

        let query = `
      SELECT s.id, s.name, s.email, s.address,
             COALESCE(AVG(r.rating), 0) as rating,
             COUNT(r.id) as rating_count
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
        const params = [];
        let paramCount = 1;

        if (name) {
            query += ` AND s.name ILIKE $${paramCount}`;
            params.push(`%${name}%`);
            paramCount++;
        }

        if (address) {
            query += ` AND s.address ILIKE $${paramCount}`;
            params.push(`%${address}%`);
            paramCount++;
        }

        query += ' GROUP BY s.id, s.name, s.email, s.address';

        if (sortBy) {
            const validSortColumns = ['name', 'email', 'address', 'rating'];
            if (validSortColumns.includes(sortBy)) {
                const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
                if (sortBy === 'rating') {
                    query += ` ORDER BY rating ${order}`;
                } else {
                    query += ` ORDER BY s.${sortBy} ${order}`;
                }
            }
        } else {
            query += ' ORDER BY s.id ASC';
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get stores error:', error);
        res.status(500).json({ error: 'Server error fetching stores' });
    }
});

router.get('/my-store', authenticateToken, requireRole('store_owner'), async (req, res) => {
    try {
        const result = await db.query(
            `SELECT s.id, s.name, s.email, s.address,
                COALESCE(AVG(r.rating), 0) as rating,
                COUNT(r.id) as rating_count
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE s.owner_id = $1
        GROUP BY s.id, s.name, s.email, s.address`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Store not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get my store error:', error);
        res.status(500).json({ error: 'Server error fetching store' });
    }
});

router.get('/my-store/ratings', authenticateToken, requireRole('store_owner'), async (req, res) => {
    try {
        const result = await db.query(
            `SELECT r.id, r.rating, r.created_at, r.updated_at,
              u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       JOIN stores s ON r.store_id = s.id
       WHERE s.owner_id = $1
       ORDER BY r.created_at DESC`,
            [req.user.id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get store ratings error:', error);
        res.status(500).json({ error: 'Server error fetching ratings' });
    }
});

module.exports = router;
