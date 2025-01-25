const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure this is correctly set in your Vercel environment
});

module.exports = async (req, res) => {

  try {
    // Test database connection
    const client = await pool.connect();
    await client.query('SELECT NOW()'); // A simple query to check connection
    client.release(); // Release the client after the query

    // If connection is successful, respond with a success message
    res.status(200).json({ message: "Database connection successful." });
  } catch (error) {
    console.error("Database connection error:", error); // Log the error for debugging
    res.status(500).json({ error: "Database connection failed." });
  }
};