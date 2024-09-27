// server.js (Node.js API for fetching approved reservations)
const express = require('express');
const app = express();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
  });

app.get('/api/reservations', async (req, res) => {
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
