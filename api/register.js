const { Pool } = require('pg');
const bcrypt = require('bcryptjs');  // To hash the password before storing

// Create a new pool instance for PostgreSQL database connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

module.exports = async (req, res) => {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password, email, userType, sbu, branch } = req.body;

  // Validate input data
  if (!username || !password || !email || !userType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Email validation regex (simple format check)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate required fields based on userType
  if (userType === 'FAST Employee') {
    if (!sbu || !branch) {
      return res.status(400).json({ error: 'SBU and Branch are required for FAST Employees' });
    }
  } else if (userType === 'Non-FAST Employee') {
    // SBU and Branch are not required for Non-FAST Employee
    // You can optionally handle any other validation for Non-FAST Employee here
  } else {
    return res.status(400).json({ error: 'Invalid user type' });
  }

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Query to insert the new user into the database
    const query = `
      INSERT INTO user_reservation (username, password, email, user_type, sbu, branch)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username;
    `;
    
    const values = [username, hashedPassword, email, userType, sbu || null, branch || null];
    
    const result = await pool.query(query, values);

    // Send success response with the inserted user data
    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: `Error registering user: ${error.message}` });
  }
};
