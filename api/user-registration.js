const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
    if (req.method === 'POST') {
    const { email, password, userType, sbu, branch, fname, lname } = req.body;

    if (!email || !password || !userType || !fname || !lname) {
        return res.status(400).json({ error: 'Missing required fields: email, password, userType, fname, and lname are required.' });
    }

    // Validate email before sending
    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
      }

    try {
    // Check database connection and execute query
    await pool.query('SELECT NOW()'); // Test the connection
  
    const client = await pool.connect();

        try {
            const emailCheckQuery = 'SELECT * FROM user_reservation WHERE email = $1';
            const emailCheckResult = await client.query(emailCheckQuery, [email]);

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

            try{
                const hashedPassword = await bcrypt.hash(password, 10);
                const insertUserQuery  = `
                INSERT INTO user_reservation (email, password, user_type, fname, lname, business_unit, branch)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id;
                `;
                const insertResult = await client.query(insertUserQuery, [fname, lname, email, hashedPassword, userType, sbu || null, branch || null]);
            
                try{
                    res.status(200).json({ message: 'Booking submitted successfully.' });
                }catch (error) {
                    console.error('Error inserting user:', error);
                    res.status(500).json({ error: `There was a problem inserting the user: ${error.message}` });
                  }

            }  catch (insertError) {
                console.error('Insert error:', insertError);
                res.status(500).json({ error: `Failed to insert user into the database: ${insertError.message}` });
              } finally {
                client.release(); // Release the database client
              }
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ error: 'Internal server error. Please try again later.' });
        }
    } catch (dbError) {
        console.error('Database connection error:', dbError);
        res.status(500).json({ error: 'Database connection error.' });
    }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
};
