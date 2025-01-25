const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure this is correctly set in your Vercel environment
});

module.exports = async (req, res) => {
  // Ensure method is POST before proceeding
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract form data from request body
  const { fname, lname, email, password, userType, sbu, branch } = req.body;

  try {

    // Insert user into the database
    await pool.query(`
      INSERT INTO user_reservation (fname, lname, email, password, user_type, business_unit, branch)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [fname, lname, email, password, userType, sbu, branch]
    );

    // Send success response
    res.status(200).end();

  } catch (error) {
    // Handle any errors that occur during database interaction
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
