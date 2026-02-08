require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
});

async function migrate() {
   const client = await pool.connect();
   try {
      console.log('Starting migration...');
      await client.query('BEGIN');

      // Add columns if they don't exist
      await client.query(`
         ALTER TABLE complaints 
         ADD COLUMN IF NOT EXISTS complaint_number VARCHAR(50) UNIQUE,
         ADD COLUMN IF NOT EXISTS assignee_name VARCHAR(255),
         ADD COLUMN IF NOT EXISTS assignee_mobile VARCHAR(20),
         ADD COLUMN IF NOT EXISTS expected_completion_days INTEGER,
         ADD COLUMN IF NOT EXISTS other_facilities TEXT,
         ADD COLUMN IF NOT EXISTS deadline_date TIMESTAMP,
         ADD COLUMN IF NOT EXISTS assign_date TIMESTAMP;
      `);

      console.log('Columns added successfully.');

      // Optionally backfill existing complaints with IDs if needed
      // For now, we assume new complaints will get the ID via code logic

      await client.query('COMMIT');
      console.log('Migration completed successfully.');
   } catch (err) {
      await client.query('ROLLBACK');
      console.error('Migration failed:', err.message);
   } finally {
      client.release();
      await pool.end();
   }
}

migrate();
