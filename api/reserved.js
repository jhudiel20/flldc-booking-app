const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.static('public'));

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// API endpoint to fetch approved reservations for Room 301
app.get('/api/reserved', async (req, res) => {
  try {
    const { room } = req.query;

    // Modify the query if reserve_date needs formatting in YYYY-MM-DD
    const reservations = await pool.query(
      "SELECT TO_CHAR(reserve_date, 'YYYY-MM-DD') as reserve_date, time FROM reservations WHERE reserve_status = 'APPROVED' AND room = $1",
      [room]
    );

    res.json(reservations.rows);
  } catch (err) {
    console.error('Error fetching reservations:', err.message);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
