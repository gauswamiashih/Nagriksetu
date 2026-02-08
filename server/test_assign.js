const axios = require('axios');
const { Pool } = require('pg');

const pool = new Pool({
   user: 'nagriksetu_admin',
   host: 'localhost',
   database: 'nagriksetu',
   password: '9664592745',
   port: 5432,
});

async function testAssign() {
   let client;
   try {
      client = await pool.connect();
      // 1. Get a complaint ID
      const res = await client.query('SELECT id FROM complaints LIMIT 1');
      if (res.rows.length === 0) {
         console.log('No complaints found to test.');
         return;
      }
      const id = res.rows[0].id;
      console.log(`Testing assignment for complaint ID: ${id}`);

      // 2. Send PATCH request
      try {
         const response = await axios.patch(`http://localhost:5000/api/complaints/${id}/assign`, {
            assignee_name: "Test Admin",
            assignee_mobile: "1234567890",
            expected_completion_days: 5,
            other_facilities: "None",
            deadline_date: new Date().toISOString()
         });
         console.log('Success:', response.status);
         console.log('Data:', response.data);
      } catch (apiError) {
         if (apiError.response) {
            const fs = require('fs');
            fs.writeFileSync('server/api_error.log', JSON.stringify(apiError.response.data, null, 2));
            console.error('Error written to api_error.log');
         } else {
            console.error('API Network Error:', apiError.message);
         }
      }

   } catch (err) {
      console.error('DB Connection Error:', err);
   } finally {
      if (client) client.release();
      pool.end();
   }
}

testAssign();
