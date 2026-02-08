require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req, res, next) => {
   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
   next();
});

// Database Connection
const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
});

// Test DB Connection
pool.connect((err, client, release) => {
   if (err) {
      return console.error('Error acquiring client', err.stack);
   }
   console.log('Connected to PostgreSQL database');
   release();
});

// Routes
const complaintsRouter = require('./routes/complaints');
const categoriesRouter = require('./routes/categories');

app.use('/api/complaints', complaintsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
   res.json({ message: 'NagrikSetu API is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
   console.error('Unhandled Error:', err);
   res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});

module.exports = { pool };
