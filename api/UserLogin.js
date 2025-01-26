const { Pool } = require("pg");
const cookie = require('cookie');
const bcrypt = require('bcryptjs'); // For password hashing and comparison
const { encryptCookie } = require('/api/encryption-key');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure this is correctly set in your Vercel environment
});

module.exports = async (req, res) => {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Destructure form data from request body
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Query the database for the user by email
    const result = await pool.query('SELECT * FROM user_reservation WHERE email = $1', [email]);

    if (result.rows.length === 1) {
      const user = result.rows[0];

      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // Prepare the cookie value with user data
        const cookieValue = {
          userId: user.id,
          email: user.email,
          firstName: user.fname,
          lastName: user.lname,
          sbu: user.business_unit,
          branch: user.branch,
          userType: user.user_type,
        };

        // Encrypt the cookie value
        const encryptedCookieValue = encryptCookie(cookieValue);

        // Set the cookie in the response header
        res.setHeader('Set-Cookie', cookie.serialize('user_data', encryptedCookieValue, {
          httpOnly: true, // Prevents JavaScript access to the cookie
          secure: process.env.NODE_ENV === 'production', // Secure in production
          maxAge: 3600, // 1 hour
          path: '/', // Cookie available to all routes
          sameSite: 'Strict', // CSRF protection
        }));

        // Send a success response
        return res.status(200).json({ message: 'Login successful. Welcome!' });
      } else {
        // Handle incorrect password
        return res.status(401).json({ error: 'Incorrect password.' });
      }
    } else {
      // Handle email not found
      return res.status(404).json({ error: 'Email not found.' });
    }
  } catch (error) {
    // Log and handle unexpected errors
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
