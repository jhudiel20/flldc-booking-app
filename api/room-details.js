const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = async (req, res) => {
  const roomId = req.query.room_id;

  try {
    const result = await pool.query('SELECT * FROM rooms WHERE room_id = $1', [roomId]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
