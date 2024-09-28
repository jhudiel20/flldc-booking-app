const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.static('public'));

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

app.get('/api/reserved', async (req, res) => {
    try {
      const { room } = req.query;
  
      // Log the room parameter to make sure it's received correctly
      console.log('Room parameter received:', room);
  
      // Ensure reserve_date is formatted properly for input type="date"
      const reservations = await pool.query(
        "SELECT TO_CHAR(reserve_date, 'YYYY-MM-DD') as reserve_date, time FROM reservations WHERE reserve_status = 'APPROVED' AND room = $1",
        [room]
      );
  
      // Log the fetched reservations to see the response before sending it
      console.log('Fetched reservations:', reservations.rows);
  
      res.json(reservations.rows);
    } catch (err) {
      // Log the exact error message for debugging
      console.error('Error fetching reservations:', err.message);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });
  

