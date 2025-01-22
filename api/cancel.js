const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = async (req, res) => {
  try {
    const { booking_id } = req.query;

    if (!booking_id) {
      console.error("Booking ID is missing in the request.");
      return res.status(400).json({ error: "Booking ID is required." });
    }

    console.log(`Fetching booking details for ID: ${booking_id}`);

    // Query to join reservations and room_details, ensuring room_image is selected
    const query = `
      SELECT r.*, rd.room_image
      FROM reservations r
      JOIN room_details rd ON rd.room_id = r.roomid
      WHERE r.booking_id = $1
    `;
    const values = [booking_id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      console.log(`No booking found for ID: ${booking_id}`);
      return res.status(404).json({ error: "No booking found." });
    }

    console.log(`Booking details fetched: ${JSON.stringify(result.rows)}`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Server error" });
  }
};
