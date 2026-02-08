const { Pool } = require('pg');

const pool = new Pool({
   user: 'nagriksetu_admin',
   host: 'localhost',
   database: 'nagriksetu',
   password: '9664592745',
   port: 5432,
});

async function checkEnum() {
   try {
      const res = await pool.query(`
            SELECT unnest(enum_range(NULL::complaint_status));
        `);
      console.log('Valid complaint_status values:', res.rows.map(r => r.unnest));
   } catch (err) {
      console.error(err);
   } finally {
      pool.end();
   }
}

checkEnum();
