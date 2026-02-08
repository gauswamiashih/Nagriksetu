const { Pool } = require('pg');

const pool = new Pool({
   user: 'nagriksetu_admin',
   host: 'localhost',
   database: 'nagriksetu',
   password: '9664592745',
   port: 5432,
});

async function checkColumns() {
   try {
      const res = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'complaints';
        `);
      const columns = res.rows.map(r => r.column_name);
      console.log(JSON.stringify(columns));
   } catch (err) {
      console.error(err);
   } finally {
      pool.end();
   }
}

checkColumns();
