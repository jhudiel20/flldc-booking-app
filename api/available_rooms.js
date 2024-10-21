const express = require('express');
const router = express.Router();  // Use Express Router
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// Route to fetch room details
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM room_details');
    res.json(result.rows);  // Send room data as JSON
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
