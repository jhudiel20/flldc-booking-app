const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = async (req, res) => {
  try {
    const { reservation_id } = req.query;

    if (!reservation_id) {
      console.error("Booking ID is missing in the request.");
      return res.status(400).json({ error: "Booking ID is required." });
    }

    console.log(`Fetching booking details for ID: ${reservation_id}`);

    // Query to join reservations and room_details, ensuring room_image is selected
    const query = `
      SELECT r.*, rd.room_photo,rd.usage,rd.capacity,rd.features,r.id,r.branch
      FROM reservations r
      JOIN room_details rd ON rd.room_id = r.roomid
      WHERE r.reservation_id = $1 OR r.booking_id = $1
    `;
    const values = [reservation_id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      console.log(`No booking found for ID: ${reservation_id}`);
      return res.status(404).json({ error: "No booking found." });
    }

    console.log(`Booking details fetched: ${JSON.stringify(result.rows)}`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching booking details:", error.message); // Log the actual error message
    res.status(500).json({ error: `Server error: ${error.message}` }); // Send the error message to the client
  }
};
