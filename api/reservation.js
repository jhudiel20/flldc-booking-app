const { Pool } = require('pg');

// Create a new pool instance for PostgreSQL database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

module.exports = async (req, res) => {
    try {
      if (req.method === "POST") {
        const { room_id, room, date } = req.body;
  
        if (room_id) {
          return await handleRoomDetails(req, res);
        } else if (room && date) {
          return await handlefetchReservations(req, res);
        } else {
          return res.status(400).json({ error: "Invalid request. Please check the provided fields." });
        }
      } else {
        return res.status(405).json({ error: "Method Not Allowed" });
      }
    } catch (error) {
      console.error("Error handling room handler :", error);
      return res.status(500).json({ error: "Server error", details: error.message });
    }
};

const handleRoomDetails = async (req, res) => {
    const { room_id } = req.body;

  // Validate the input
  if (!room_id) {
    return res.status(400).json({ error: 'Room ID is required' });
  }

  try {
    // Query to select all columns for the given room_id
    const query = 'SELECT * FROM room_details WHERE room_id = $1';
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

const handlefetchReservations = async (req, res) => {
    const { room, date } = req.body;

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
