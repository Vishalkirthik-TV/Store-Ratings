const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { authenticateToken } = require('../middleware');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, address } = req.body;

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

        const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role',
            [name, email, hashedPassword, address, 'user']
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await db.query(
            'SELECT id, name, email, password, address, role, store_id FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                storeId: user.store_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role,
            storeId: user.store_id
        };

        res.json({ token, user: userData });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

router.post('/update-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
        if (!newPassword || !passwordRegex.test(newPassword)) {
            return res.status(400).json({ error: 'Password must be 8-16 characters with at least one uppercase letter and one special character' });
        }

        const result = await db.query('SELECT password FROM users WHERE id = $1', [req.user.id]);
        const user = result.rows[0];

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id]);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password update error:', error);
        res.status(500).json({ error: 'Server error during password update' });
    }
});

module.exports = router;

