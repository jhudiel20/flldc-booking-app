// api/reservation.js
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
  });

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { room, reserve_date, time } = req.body;

        try {
            // Insert reservation into the database
            const result = await pool.query(
                `INSERT INTO reservations (room, reserve_date, time, status) 
                 VALUES ($1, $2, $3, 'pending') RETURNING *`,
                [room, reserve_date, time]
            );

            res.status(201).json({ message: 'Reservation created', reservation: result.rows[0] });
        } catch (error) {
            console.error('Error creating reservation:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
