const { Pool } = require('pg');

const pool = new Pool({
   user: 'nagriksetu_admin',
   host: 'localhost',
   database: 'nagriksetu',
   password: '9664592745',
   port: 5432,
});

async function fixEnum() {
   try {
      console.log('Adding "in-progress" to complaint_status enum...');
      // PostgreSQL cannot use "IF NOT EXISTS" inside ADD VALUE directly in older versions, 
      // but recent ones support it. If it fails, we catch it.
      await pool.query(`ALTER TYPE complaint_status ADD VALUE IF NOT EXISTS 'in-progress';`);
      console.log('Successfully added "in-progress" to enum.');
   } catch (err) {
      console.error('Error adding enum value:', err.message);
   } finally {
      pool.end();
   }
}

fixEnum();
