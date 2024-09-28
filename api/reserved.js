const express = require('express');
const { Pool } = require('pg'); // Ensure you're importing `Pool` from `pg`
const app = express();

// Create a new Pool using the environment variable for the PostgreSQL connection URL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,  // Environment variable for the database connection
});

app.get('/api/reserved', async (req, res) => {
  try {
    const { room } = req.query; // optional: filter by room if needed
    const reservations = await pool.query(
      "SELECT reserve_date, time FROM reservations WHERE reserve_status = 'APPROVED' AND room = $1", 
      [room]
    );
    res.json(reservations.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
