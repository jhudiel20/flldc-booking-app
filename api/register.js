const { Pool } = require("pg");
const bcrypt = require("bcryptjs"); // To hash the password before storing

// Create a new pool instance for PostgreSQL database connection
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

module.exports = async (req, res) => {
    // Only accept GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password, userType, sbu, branch } = req.query;

    // Validate input data
    if (!email || !password || !userType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        // Check if email already exists in the database
        const emailCheckQuery = 'SELECT * FROM user_reservation WHERE email = $1';
        const emailCheckResult = await pool.query(emailCheckQuery, [email]);

        if (emailCheckResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Validate fields for FAST Employee
        if (userType === 'FAST Employee') {
            if (!sbu || !branch) {
                return res.status(400).json({ error: 'SBU and Branch are required for FAST Employees' });
            }
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const query = `
            INSERT INTO user_reservation (email, password, user_type, sbu, branch)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING email, user_type;
        `;
        const values = [email, hashedPassword, userType, sbu || null, branch || null];
        const result = await pool.query(query, values);

        // Respond with success
        return res.status(200).json({
            success: true,
            user: result.rows[0],
        });
    } catch (error) {
        return res.status(500).json({ error: 'An unexpected error occurred.' });
    }
};
