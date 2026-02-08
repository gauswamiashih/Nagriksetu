const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { logAction } = require('../utils/logger');

const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
   try {
      const { email, password, name, phone } = req.body;

      // Check if user exists
      const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (userCheck.rows.length > 0) {
         return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Insert user
      // Check if user is admin based on email
      const assignedRole = email === 'gauswamiashish760@gmail.com' ? 'ADMIN' : 'CITIZEN';

      const newUser = await pool.query(
         'INSERT INTO users (full_name, email, phone_number, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email, role, created_at',
         [name, email, phone || '', passwordHash, assignedRole]
      );

      const user = newUser.rows[0];
      res.json({
         id: user.id,
         name: user.full_name,
         email: user.email,
         role: user.role,
         createdAt: user.created_at
      });

   } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
   }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
   try {
      const { email, password } = req.body;

      // Check user
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
         return res.status(400).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
         return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Log action
      await logAction(pool, user.id, user.email, 'LOGIN', 'User login');

      // Return user data (excluding password)
      res.json({
         id: user.id,
         name: user.full_name,
         email: user.email,
         role: user.role.toLowerCase(), // Frontend expects lowercase
         createdAt: user.created_at
      });

   } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
   }
});

module.exports = router;
