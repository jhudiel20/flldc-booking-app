const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = async (req, res) => {
  try {
    // Get the bedroomType from the query parameters
    const { bedroomtype } = req.query;

    // Modify the SQL query to filter by bedroomType
    const query = 'SELECT * FROM bed_details WHERE status = \'Available\' AND bed_room = $1 ORDER BY bed_name ASC';
    const values = [bedroomtype];
    
    // Execute the query with the bedroomType as a parameter
    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
