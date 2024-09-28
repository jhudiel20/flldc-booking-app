const { Pool } = require('pg');

// Create a new pool instance for PostgreSQL database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

module.exports = async (req, res) => {
  const { room, date } = req.query; // Get room and date from query parameters

  try {
    // Query to get reserved slots based on room and date
    const query = `
      SELECT reserve_date, time
      FROM reservations
      WHERE room = $1 AND reserve_status = 'APPROVED'
      AND reserve_date = $2
    `;
    const values = [room, date];
    
    const result = await pool.query(query, values);
    
    // Send back the reserved slots as JSON
    res.status(200).json(result.rows); 
  } catch (error) {
    console.error('Error fetching reserved slots:', error);
    res.status(500).send(`Error fetching reserved slots: ${error.message}`);
  }
};
