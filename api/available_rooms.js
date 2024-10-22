const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM room_details where status = "Available" ');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
