const { Pool } = require('pg');

// PostgreSQL connection using connection string from environment variables
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

// Function to validate form input
const validateInput = (data) => {
  const { rating } = data;
  const errors = [];

  if (!rating) errors.push('Please select stars.');


  return errors;
};

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    // Destructure form fields from the request body
    const { rating } = req.body;

    // Validate input
    const errors = validateInput(req.body);
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      return res.status(400).json({ errors }); // Send validation errors to the front-end
    }

    // Check database connection and execute query
    try {
      await pool.query('SELECT NOW()'); // Test the connection

      const client = await pool.connect();
      try {
        // SQL query to insert data into the reservations table
        const result = await client.query(
          `INSERT INTO reserve_rating (rating)
          VALUES ($1) RETURNING id`,
          [rating]
        );

        const responseMessage = { message: 'Rating successful!', ratingId: result.rows[0].id };
        console.log('Response:', responseMessage);
        // Return success message and the inserted reservation ID
        res.status(200).json(responseMessage);
      } catch (error) {
        // Handle SQL query error
        console.error('Error rating:', error.message);
        const errorMessage = { error: `Error rating: ${error.message}` };
        console.log('Response:', errorMessage);
        res.status(500).json(errorMessage);
      } finally {
        client.release(); // Release client after query execution
      }
    } catch (error) {
      // Handle connection error
      console.error('Database connection error:', error.message);
      const errorMessage = { error: `Failed to connect to the database: ${error.message}` };
      console.log('Response:', errorMessage);
      res.status(500).json(errorMessage);
    }
  } else {
    // Only allow POST requests
    const errorMessage = { error: 'Method not allowed' };
    console.log('Response:', errorMessage);
    res.status(405).json(errorMessage);
  }
};
