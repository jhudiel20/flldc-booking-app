const { Pool } = require('pg');
const express = require('express');
const app = express();

// Create a new pool instance for the PostgreSQL database
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

// Endpoint to fetch reserved dates and times for a specific room
app.get('/api/reservations', async (req, res) => {
  const { room, date } = req.query; // Get room and date from query parameters
  
  try {
    // Query to get reserved slots based on the room and date
    const query = `
      SELECT reserve_date, time
      FROM reservations
      WHERE room = $1 AND reserved_status = 'APPROVED'
      AND reserve_date = $2
    `;
    const values = [room, date];
    
    const result = await pool.query(query, values);
    
    // Send back the reserved slots
    res.json(result.rows); 
  } catch (error) {
    console.error('Error fetching reserved slots:', error.message);
    res.status(500).send(`Error fetching reserved slots: ${error.message}`);
  }
});

// Start the server on port 3000 (or use a different port as necessary)
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
