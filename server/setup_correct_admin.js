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

async function setupCorrectAdmin() {
   try {
      const email = 'gauswamiashish760@gmail.com';
      const password = 'admin123';
      const name = 'Ashish Gauswami';

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Check if user exists
      const check = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (check.rows.length > 0) {
         // Update existing
         await pool.query('UPDATE users SET password_hash = $1, role = $2 WHERE email = $3', [passwordHash, 'ADMIN', email]);
         console.log(`Updated password and role for ${email}`);
      } else {
         // Create new
         await pool.query(
            "INSERT INTO users (full_name, email, phone_number, password_hash, role) VALUES ($1, $2, '9876543210', $3, 'ADMIN')",
            [name, email, passwordHash]
         );
         console.log(`Created new admin ${email}`);
      }

      console.log(`\n✅ Correct Admin Credentials:\nEmail: ${email}\nPassword: ${password}`);

   } catch (err) {
      console.error('Error:', err);
   } finally {
      pool.end();
   }
}

setupCorrectAdmin();
