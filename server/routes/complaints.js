const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const { logAction } = require('../utils/logger');

// Database configuration matches index.js
const pool = new Pool({
   user: process.env.DB_USER,
   host: process.env.DB_HOST,
   database: process.env.DB_NAME,
   password: process.env.DB_PASSWORD,
   port: process.env.DB_PORT,
});

// Configure Multer for image upload
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads/');
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
   },
});

const upload = multer({ storage: storage });

// GET all complaints
router.get('/', async (req, res) => {
   try {
      const result = await pool.query(`
      SELECT c.*, cat.name as category_name, u.full_name as user_name 
      FROM complaints c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `);
      res.json(result.rows);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
   }
});

// POST a new complaint
router.post('/', upload.single('image'), async (req, res) => {
   try {
      console.log('POST /complaints request body:', req.body);
      console.log('POST /complaints file:', req.file);

      const { title, description, category_id, latitude, longitude, address, user_id } = req.body;

      // Simple validation
      if (!title || !description || !category_id || !user_id) {
         return res.status(400).json({ error: 'Missing required fields' });
      }

      const client = await pool.connect();
      try {
         await client.query('BEGIN');

         // Generate Unique Complaint ID: #ANTIG-YYYY-XXX
         const year = new Date().getFullYear();
         // Get the count of complaints for this year to increment
         const countResult = await client.query('SELECT COUNT(*) FROM complaints WHERE EXTRACT(YEAR FROM created_at) = $1', [year]);
         const count = parseInt(countResult.rows[0].count, 10) + 1;
         const complaint_number = `#ANTIG-${year}-${String(count).padStart(3, '0')}`;

         const newComplaint = await client.query(
            'INSERT INTO complaints (title, description, category_id, latitude, longitude, address, user_id, complaint_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            [title, description, category_id, latitude, longitude, address, user_id, complaint_number]
         );

         const newComplaintId = newComplaint.rows[0].id;

         // If image exists, save it
         if (req.file) {
            const imageUrl = `/uploads/${req.file.filename}`;
            await client.query(
               'INSERT INTO complaint_images (complaint_id, image_url) VALUES ($1, $2)',
               [newComplaintId, imageUrl]
            );
         }

         await client.query('COMMIT');

         // Log action
         await logAction(client, user_id, null, 'CREATE_COMPLAINT', `Created complaint ${complaint_number}`);

         const fullComplaint = await client.query(`
            SELECT c.*, cat.name as category_name, u.full_name as user_name,
            (SELECT json_agg(json_build_object('id', ci.id, 'url', ci.image_url)) 
             FROM complaint_images ci WHERE ci.complaint_id = c.id) as images
            FROM complaints c
            LEFT JOIN categories cat ON c.category_id = cat.id
            LEFT JOIN users u ON c.user_id = u.id
            WHERE c.id = $1
         `, [newComplaintId]);

         res.json(fullComplaint.rows[0]);
      } catch (err) {
         await client.query('ROLLBACK');
         throw err;
      } finally {
         client.release();
      }
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message, stack: err.stack });
   }
});

// POST upload image
router.post('/:id/images', upload.single('image'), async (req, res) => {
   try {
      const { id } = req.params;
      if (!req.file) {
         return res.status(400).json({ error: 'No image uploaded' });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      const newImage = await pool.query(
         'INSERT INTO complaint_images (complaint_id, image_url) VALUES ($1, $2) RETURNING *',
         [id, imageUrl]
      );

      res.json(newImage.rows[0]);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
   }
});

// PATCH update status
router.patch('/:id/status', async (req, res) => {
   try {
      const { id } = req.params;
      const { status } = req.body;

      const updateComplaint = await pool.query(
         'UPDATE complaints SET status = $1 WHERE id = $2 RETURNING *',
         [status, id]
      );

      if (updateComplaint.rows.length === 0) {
         return res.status(404).json({ error: 'Complaint not found' });
      }

      // Log action
      await logAction(pool, req.user?.id || null, req.user?.email || 'admin', 'UPDATE_STATUS', `Updated complaint ${id} status to ${status}`);

      res.json(updateComplaint.rows[0]);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
   }
});

// PATCH assign complaint
router.patch('/:id/assign', async (req, res) => {
   try {
      const { id } = req.params;
      console.log(`PATCH /complaints/${id}/assign called`);
      console.log('Request Request Body:', req.body);

      const {
         assignee_name,
         assignee_mobile,
         expected_completion_days,
         other_facilities,
         deadline_date
      } = req.body;

      const assign_date = new Date();

      const updateComplaint = await pool.query(
         `UPDATE complaints SET 
            assignee_name = $1, 
            assignee_mobile = $2, 
            expected_completion_days = $3, 
            other_facilities = $4, 
            deadline_date = $5,
            assign_date = $6,
            status = 'in-progress'
          WHERE id = $7 RETURNING *`,
         [assignee_name, assignee_mobile, expected_completion_days, other_facilities, deadline_date, assign_date, id]
      );

      if (updateComplaint.rows.length === 0) {
         console.error(`Complaint ${id} not found during assignment`);
         return res.status(404).json({ error: 'Complaint not found' });
      }

      console.log('Assignment successful, DB row updated:', updateComplaint.rows[0]);

      // Log action
      await logAction(pool, req.user?.id || null, req.user?.email || 'admin', 'ASSIGN_COMPLAINT', `Assigned complaint ${id} to ${assignee_name}`);

      res.json(updateComplaint.rows[0]);
   } catch (err) {
      console.error('Error in PATCH /assign:', err.message);
      res.status(500).json({ error: 'Server error: ' + err.message });
   }
});

// GET status history
router.get('/:id/history', async (req, res) => {
   try {
      const { id } = req.params;
      const history = await pool.query(
         'SELECT * FROM status_history WHERE complaint_id = $1 ORDER BY updated_at DESC',
         [id]
      );
      res.json(history.rows);
   } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
   }
});

module.exports = router;
