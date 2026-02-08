require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
});

async function fixUser() {
   try {
      const email = 'gauswamiashish760@gmail.com';
      const password = 'admin123';
      const name = 'Ashish Gauswami'; // Assuming name based on email

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Check if user exists
      const check = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (check.rows.length > 0) {
         // Update existing user to be ADMIN and set password
         await pool.query(
            "UPDATE users SET password_hash = $1, role = 'ADMIN' WHERE email = $2",
            [passwordHash, email]
         );
         console.log(`✅ Updated existing user ${email} to ADMIN with password: ${password}`);
      } else {
         // Create new ADMIN user
         await pool.query(
            "INSERT INTO users (full_name, email, phone_number, password_hash, role) VALUES ($1, $2, '9999999999', $3, 'ADMIN')",
            [name, email, passwordHash]
         );
         console.log(`✅ Created new ADMIN user ${email} with password: ${password}`);
      }

   } catch (err) {
      console.error('Error:', err);
   } finally {
      pool.end();
   }
}

fixUser();
