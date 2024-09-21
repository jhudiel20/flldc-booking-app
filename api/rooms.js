const { Pool } = require('pg');

// PostgreSQL connection using connection string from environment variables
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

// Function to validate form input
const validateInput = (data) => {
  const { reserve_date, businessunit, room, guest, contact, email } = data;
  const errors = [];

  if (!reserve_date) errors.push('Reservation date is required.');
  if (!businessunit) errors.push('Business unit is required.');
  if (!guest) errors.push('Guest is required.');
  if (!room) errors.push('Room is required.');
  if (!contact) errors.push('Contact number is required.');
  if (!email) {
    errors.push('Email is required.');
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push('Email format is invalid.');
  }

  return errors;
};

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { reserve_date, businessunit, room, guest, contact, email, table, hdmi, extension, message } = req.body;
    const errors = validateInput(req.body);
    
    if (errors.length > 0) {
      return res.status(400).json({ errors }); // Send validation errors
    }

    try {
      const client = await pool.connect();
      try {
        const result = await client.query(
          `INSERT INTO reservations (reserve_date, business_unit, room, guest, contact, email, "table", hdmi, extension, message)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
          [reserve_date, businessunit, room, guest, contact, email, table, hdmi, extension, message]
        );
        
        res.status(200).json({ message: 'Booking successful!', reservationId: result.rows[0].id }); // Return success
      } catch (error) {
        res.status(500).json({ error: `Error booking room: ${error.message}` }); // Return backend error
      } finally {
        client.release();
      }
    } catch (error) {
      res.status(500).json({ error: `Failed to connect to the database: ${error.message}` }); // Return connection error
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

