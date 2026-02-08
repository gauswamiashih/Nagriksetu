const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Database configuration matches index.js
const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
});

// GET all categories
router.get('/', async (req, res) => {
   try {
      const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
      res.json(result.rows);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
   }
});

module.exports = router;
