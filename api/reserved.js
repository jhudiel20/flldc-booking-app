// Import necessary modules
const express = require('express');
const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
  });

app.get('/api/reserved', async (req, res) => {
    try {
      const { room } = req.query;
  
      // Check if 'room' query parameter is provided
      if (!room) {
        return res.status(400).json({ error: 'Room parameter is required' });
      }
  
      // Log the room being queried
      console.log('Querying room:', room);
  
      // Query the database for reservations with 'APPROVED' status for the given room
      const reservations = await pool.query(
        "SELECT TO_CHAR(reserve_date, 'YYYY-MM-DD') as reserve_date, time FROM reservations WHERE reserve_status = 'APPROVED' AND room = $1",
        [room]
      );
  
      // Log query results
      console.log('Reservations found:', reservations.rows);
  
      // If no reservations are found, return an empty array
      if (reservations.rows.length === 0) {
        return res.json([]);
      }
  
      // Return the reservations data in JSON format
      res.json(reservations.rows);
    } catch (err) {
      console.error('Error fetching reservations:', err.message, err.stack);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });