const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const { email, password, userType, sbu, branch, fname, mname, lname } = req.body;

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

        const query = `
            INSERT INTO user_reservation (email, password, user_type, fname, mname, lname, sbu, branch)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const values = [
            email, 
            hashedPassword, 
            userType, 
            fname, 
            mname || null, // Middle name is optional
            lname, 
            userType === 'FAST Employee' ? sbu : null, 
            userType === 'FAST Employee' ? branch : null
        ];

        console.log('Executing query with values:', values);
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(500).json({ error: 'Failed to create user.' });
        }

        return res.status(201).json({
            success: true,
            user: result.rows[0],
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: `Server error: ${error.message}` });
    }
};
