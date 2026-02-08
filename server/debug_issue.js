const { Pool } = require('pg');
const http = require('http');
require('dotenv').config();

const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
});

async function run() {
   try {
      // 1. Get User
      const userRes = await pool.query('SELECT id, full_name FROM users LIMIT 1');
      if (userRes.rows.length === 0) {
         console.error('No users found!');
         return;
      }
      const user = userRes.rows[0];
      console.log('Found user:', user);

      // 2. Get Category
      const catRes = await pool.query("SELECT id, name FROM categories WHERE name = 'Electricity' LIMIT 1");
      if (catRes.rows.length === 0) {
         console.error('Category not found!');
         return;
      }
      const category = catRes.rows[0];
      console.log('Found category:', category);

      // 3. Make Request
      const postData = JSON.stringify({
         title: 'Debug Issue',
         description: 'This is a debug issue created via script to test the backend API.',
         category_id: category.id,
         latitude: 18.5204,
         longitude: 73.8567,
         address: 'Debug Address',
         user_id: user.id
      });

      const options = {
         hostname: 'localhost',
         port: 5000,
         path: '/api/complaints',
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
         },
      };

      console.log('Sending request to /api/complaints...');
      const req = http.request(options, (res) => {
         console.log(`STATUS: ${res.statusCode}`);
         console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
         res.setEncoding('utf8');
         res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
         });
         res.on('end', () => {
            console.log('No more data in response.');
            pool.end();
         });
      });

      req.on('error', (e) => {
         console.error(`problem with request: ${e.message}`);
         pool.end();
      });

      // Write data to request body
      req.write(postData);
      req.end();

   } catch (err) {
      console.error('Error:', err);
      pool.end();
   }
}

run();
