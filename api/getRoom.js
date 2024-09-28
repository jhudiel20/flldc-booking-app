const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
  });

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const result = await pool.query('SELECT * FROM rooms');
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};