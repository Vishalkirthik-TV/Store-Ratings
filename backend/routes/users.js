const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database');
const { authenticateToken, requireRole } = require('../middleware');

const router = express.Router();

router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

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

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({ error: 'Password must be 8-16 characters with at least one uppercase letter and one special character' });
        }

        if (!['admin', 'user', 'store_owner'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role',
            [name, email, hashedPassword, address, role]
        );

        res.status(201).json({
            message: 'User created successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('User creation error:', error);
        res.status(500).json({ error: 'Server error during user creation' });
    }
});

router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const { name, email, address, role, sortBy, sortOrder } = req.query;

        let query = `
      SELECT u.id, u.name, u.email, u.address, u.role, 
             COALESCE(AVG(r.rating), 0) as rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
        const params = [];
        let paramCount = 1;

        if (name) {
            query += ` AND u.name ILIKE $${paramCount}`;
            params.push(`%${name}%`);
            paramCount++;
        }

        if (email) {
            query += ` AND u.email ILIKE $${paramCount}`;
            params.push(`%${email}%`);
            paramCount++;
        }

        if (address) {
            query += ` AND u.address ILIKE $${paramCount}`;
            params.push(`%${address}%`);
            paramCount++;
        }

        if (role) {
            query += ` AND u.role = $${paramCount}`;
            params.push(role);
            paramCount++;
        }

        query += ' GROUP BY u.id, u.name, u.email, u.address, u.role';

        if (sortBy) {
            const validSortColumns = ['name', 'email', 'address', 'role'];
            if (validSortColumns.includes(sortBy)) {
                const order = sortOrder === 'desc' ? 'DESC' : 'ASC';
                query += ` ORDER BY u.${sortBy} ${order}`;
            }
        } else {
            query += ' ORDER BY u.id ASC';
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error fetching users' });
    }
});

router.get('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `SELECT u.id, u.name, u.email, u.address, u.role,
              COALESCE(AVG(r.rating), 0) as rating
       FROM users u
       LEFT JOIN stores s ON u.id = s.owner_id
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE u.id = $1
       GROUP BY u.id, u.name, u.email, u.address, u.role`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error fetching user' });
    }
});

router.get('/stats/dashboard', authenticateToken, requireRole('admin'), async (req, res) => {
    try {
        const usersCount = await db.query('SELECT COUNT(*) FROM users');
        const storesCount = await db.query('SELECT COUNT(*) FROM stores');
        const ratingsCount = await db.query('SELECT COUNT(*) FROM ratings');

        res.json({
            totalUsers: parseInt(usersCount.rows[0].count),
            totalStores: parseInt(storesCount.rows[0].count),
            totalRatings: parseInt(ratingsCount.rows[0].count)
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Server error fetching dashboard stats' });
    }
});

module.exports = router;
