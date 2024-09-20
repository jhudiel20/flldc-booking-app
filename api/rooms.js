const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { room, date } = req.body;
    const client = await pool.connect();
    try {
      const result = await client.query('INSERT INTO reservations (room, date) VALUES ($1, $2)', [room, date]);
      res.status(200).json({ message: 'Booking successful!' });
    } catch (error) {
      res.status(500).json({ error: 'Error booking room' });
    } finally {
      client.release();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
