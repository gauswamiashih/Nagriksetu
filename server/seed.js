const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
});

async function seedCategories() {
   try {
      console.log('Checking categories...');
      const res = await pool.query('SELECT COUNT(*) FROM categories');
      const count = parseInt(res.rows[0].count);
      console.log(`Current category count: ${count}`);

      if (count === 0) {
         console.log('Seeding categories...');
         const query = `
        INSERT INTO categories (name, description) VALUES
        ('Roads', 'Potholes, damaged roads, and construction issues'),
        ('Water Supply', 'Pipeline leakage, no water supply, contaminated water'),
        ('Sanitation', 'Garbage collection, sewage issues, public toilets'),
        ('Electricity', 'Street lights not working, power cuts'),
        ('Public Safety', 'Theft, harassment, suspicious activities')
        RETURNING *;
      `;
         const inserted = await pool.query(query);
         console.log(`Inserted ${inserted.rowCount} categories.`);
      } else {
         console.log('Categories already exist.');
         const cats = await pool.query('SELECT * FROM categories');
         console.log(cats.rows);
      }
   } catch (err) {
      console.error('Error seeding categories:', err);
   } finally {
      await pool.end();
   }
}

seedCategories();
