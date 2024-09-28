// Import necessary modules
const express = require('express');
const { Pool } = require('pg'); // Import Pool from pg for PostgreSQL connections
require('dotenv').config(); // Load environment variables from a .env file if available

const app = express();

// Create a new Pool using the environment variable for PostgreSQL connection URL
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure POSTGRES_URL is set in your environment
});

// API endpoint to fetch approved reservations based on the room
app.get('/api/reserved', async (req, res) => {
  try {
    const { room } = req.query; // Room filtering if needed

    // Check if the room parameter is provided
    if (!room) {
      return res.status(400).json({ error: 'Room parameter is required' });
    }

    // Log the room parameter for debugging
    console.log('Room parameter received:', room);

    // Query to get approved reservations for the given room, format reserve_date for HTML date input
    const reservations = await pool.query(
      "SELECT TO_CHAR(reserve_date, 'YYYY-MM-DD') as reserve_date, time FROM reservations WHERE reserve_status = 'APPROVED' AND room = $1",
      [room] // Using parameterized query to prevent SQL injection
    );

    // Log the fetched reservations to verify the data
    console.log('Fetched reservations:', reservations.rows);

    // Handle case when no approved reservations are found
    if (reservations.rows.length === 0) {
      return res.status(404).json({ error: 'No approved reservations found for this room' });
    }

    res.json(reservations.rows); // Return the result as JSON
  } catch (err) {
    // Log the exact error message for debugging
    console.error('Error fetching reservations:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Start the server on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
