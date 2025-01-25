const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const { email, password, userType, sbu, branch, fname, lname } = req.body;

    if (!email || !password || !userType || !fname || !lname) {
        return res.status(400).json({ error: 'Missing required fields: email, password, userType, fname, and lname are required.' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    try {
        const emailCheckQuery = 'SELECT * FROM user_reservation WHERE email = $1';
        const emailCheckResult = await pool.query(emailCheckQuery, [email]);

        if (emailCheckResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
        }

        if (userType === 'FAST Employee') {
            if (!sbu || !branch) {
                return res.status(400).json({ error: 'SBU and Branch are required for FAST Employees.' });
            }
        }

        if (!password) {
            return res.status(400).json({ error: 'Password is required.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery  = `
            INSERT INTO user_reservation (email, password, user_type, fname, lname, business_unit, branch)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
        `;
        const insertResult = await pool.query(insertUserQuery, [fname, lname, email, hashedPassword, userType, sbu || null, branch || null]);

        if (insertResult.rowCount > 0) {
            return res.status(201).json({ success: true, message: 'Registration successful.' });
        } else {
            return res.status(500).json({ error: 'Failed to register user. Please try again.' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
};
