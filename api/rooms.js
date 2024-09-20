const { Pool } = require('pg');

// PostgreSQL connection using connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    // Destructure form fields from the request body
    const { reserve_date, businessunit, room, contact, email, table, hdmi, extension, message } = req.body;
    
    const client = await pool.connect();
    
    try {
      // SQL query to insert data into reservations table
      const result = await client.query(
        `INSERT INTO reservations (reserve_date, business_unit, room, contact, email, table, hdmi, extension, message)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`, 
        [reserve_date, businessunit, room, contact, email, table, hdmi, extension, message]
      );
      
      // Return success message and the inserted reservation ID
      res.status(200).json({ message: 'Booking successful!', reservationId: result.rows[0].id });
    } catch (error) {
      // Error handling
      console.error('Error booking room:', error);
      res.status(500).json({ error: 'Error booking room' });
    } finally {
      client.release();
    }
  } else {
    // Only allow POST requests
    res.status(405).json({ error: 'Method not allowed' });
  }
};
