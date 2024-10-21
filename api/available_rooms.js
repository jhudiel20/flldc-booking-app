const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

app.use(cors());

// Route to fetch room details
app.get('/api/available_rooms', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM room_details');
      res.json(result.rows); // Send all room data as JSON
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).send('Server error');
    }
  });