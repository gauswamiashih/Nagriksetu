const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
   user: process.env.DB_USER || 'postgres',
   host: process.env.DB_HOST || 'localhost',
   database: process.env.DB_NAME || 'nagriksetu',
   password: process.env.DB_PASSWORD || 'password',
   port: process.env.DB_PORT || 5432,
});

async function migrateLogs() {
   try {
      await client.connect();
      console.log('Connected to database for logging migration...');

      await client.query(`
      CREATE TABLE IF NOT EXISTS action_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        user_email VARCHAR(255),
        action VARCHAR(50) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

      console.log('Logs table created successfully.');
   } catch (err) {
      console.error('Migration error:', err);
   } finally {
      await client.end();
   }
}

migrateLogs();
