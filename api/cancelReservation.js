const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = async (req, res) => {
  try {
    const { reservation_id } = req.query;

    if (!reservation_id) {
      console.error("Reservation ID is missing in the request.");
      return res.status(400).json({ error: "Reservation ID is required." });
    }

    console.log(`Cancelling reservation for ID: ${reservation_id}`);

    const query = `
      UPDATE reservations
      SET reserve_status = 'CANCELLED'
      WHERE id = $1
      RETURNING *;
    `;
    const values = [reservation_id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      console.log(`No reservation found for ID: ${reservation_id}`);
      return res.status(404).json({ error: "No reservation found to cancel." });
    }

    console.log(`Reservation cancelled: ${JSON.stringify(result.rows[0])}`);
    res.status(200).json({ message: "Reservation cancelled successfully.", data: result.rows[0] });
  } catch (error) {
    console.error("Error cancelling reservation:", error.message);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};
