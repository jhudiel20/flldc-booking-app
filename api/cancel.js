const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = async (req, res) => {
  try {
    // Extract booking_id from query parameters
    const { booking_id } = req.query;

    if (!booking_id) {
      return res.status(400).json({ error: "Booking ID is required." });
    }

    // Query the database
    const query = "SELECT * FROM bed_details WHERE booking_id = $1";
    const values = [booking_id];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Server error" });
  }
};
