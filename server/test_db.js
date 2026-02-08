require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
});

pool.query('SELECT NOW()', (err, res) => {
   if (err) {
      console.error('Connection error:', err);
   } else {
      console.log('Connection successful:', res.rows[0]);
   }
   pool.end();
});
