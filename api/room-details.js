const { Pool } = require('pg');

// Initialize the connection pool using the PostgreSQL connection string from environment variables
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = async (req, res) => {
  const { room_id } = req.query;

  // Validate the input
  if (!room_id) {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  try {
    // Query to select all columns for the given room_id
    const query = 'SELECT * FROM rooms WHERE room_id = $1';
    const values = [room_id];

    const result = await pool.query(query, values);

    // If no rows are found, return a 404 status
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Send the room details as the response
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
