// api/checkAvailability.js

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
  });

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { room, reserve_date, time } = req.body;

        try {
            // Query to check for existing reservations
            const result = await pool.query(
                `SELECT * FROM reservations 
                 WHERE room = $1 AND reserve_date = $2 AND time = $3 AND status = 'approved'`,
                [room, reserve_date, time]
            );

            // Check if there are any reservations
            if (result.rows.length > 0) {
                return res.status(200).json({ available: false, reservations: result.rows });
            }

            res.status(200).json({ available: true });
        } catch (error) {
            console.error('Error checking availability:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
