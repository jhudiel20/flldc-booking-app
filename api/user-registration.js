const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const bcrypt = require("bcryptjs"); // To hash the password before storing

module.exports = async (req, res) => {
    // Only accept POST requests (Registration typically uses POST)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const { email, password, userType, sbu, branch } = req.body; // Use req.body for POST

    // Validate input data
    if (!email || !password || !userType) {
        return res.status(400).json({ error: 'Missing required fields: email, password, and userType are required.' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    try {
        // Check if email already exists in the database
        const emailCheckQuery = 'SELECT * FROM user_reservation WHERE email = $1';
        const emailCheckResult = await pool.query(emailCheckQuery, [email]);

        if (emailCheckResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
        }

        // Validate fields for FAST Employee
        if (userType === 'FAST Employee') {
            if (!sbu || !branch) {
                return res.status(400).json({ error: 'SBU and Branch are required for FAST Employees.' });
            }
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const query = `
            INSERT INTO user_reservation (email, password, user_type, sbu, branch)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;  // Ensure that the new user data is returned
        `;
        const values = [
            email, 
            hashedPassword, 
            userType, 
            userType === 'FAST Employee' ? sbu : null,  // Use null for non-FAST employees
            userType === 'FAST Employee' ? branch : null  // Use null for non-FAST employees
        ];
        const result = await pool.query(query, values);

        // Check if user was successfully created
        if (result.rows.length === 0) {
            return res.status(500).json({ error: 'Failed to create user.' });
        }

        // Respond with success
        return res.status(201).json({
            success: true,
            user: result.rows[0], // Return the newly created user data
        });
    } catch (error) {
        // Catch any errors and return a 500 status with the error message
        console.error('Error during registration:', error); // Log the error for debugging
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
};
