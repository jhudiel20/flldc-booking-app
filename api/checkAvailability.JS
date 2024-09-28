// api/checkAvailability.js

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
  });

  const getReservedDatesAndTimes = async (room) => {
    try {
        const result = await pool.query(
            `SELECT reserve_date, time FROM reservations 
             WHERE room = $1 AND status = 'approved'`,
            [room]
        );
        return result.rows; // Return the list of reserved dates and times
    } catch (error) {
        console.error('Error retrieving reserved dates and times:', error);
        throw error; // Rethrow the error to be handled in the main function
    }
};

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { room, reserve_date, time } = req.body;

        try {
            // Get reserved dates and times for the room
            const reservedSlots = await getReservedDatesAndTimes(room);

            // Check if the requested date and time are available
            const isReserved = reservedSlots.some(slot => 
                slot.reserve_date === reserve_date && slot.time === time
            );

            if (isReserved) {
                return res.status(200).json({ available: false, message: 'Room is already reserved for this date and time.' });
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