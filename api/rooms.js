const { Pool } = require('pg');

// PostgreSQL connection using connection string from environment variables
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

// Function to validate form input
const validateInput = (data) => {
  const { reserve_date, businessunit, room, contact, email } = data;
  const errors = [];

  if (!reserve_date) errors.push('Reservation date is required.');
  if (!businessunit) errors.push('Business unit is required.');
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
    // Destructure form fields from the request body
    const { reserve_date, businessunit, room, contact, email, table, hdmi, extension, message } = req.body;

    // Validate input
    const errors = validateInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Check database connection
    try {
      await pool.query('SELECT NOW()'); // Test the connection

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
        // Error handling for SQL query
        console.error('Error booking room:', error.message);
        res.status(500).json({ error: `Error booking room: ${error.message}` });
      } finally {
        client.release();
      }
    } catch (error) {
      // Error handling for connection
      console.error('Database connection error:', error.message);
      res.status(500).json({ error: `Failed to connect to the database: ${error.message}` });
    }
  } else {
    // Only allow POST requests
    res.status(405).json({ error: 'Method not allowed' });
  }
};
