const { Pool } = require("pg");
const cookie = require('cookie');
const crypto = require('crypto');
const bcrypt = require('bcryptjs'); // For password hashing and comparison
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure this is correctly set in your Vercel environment
});

module.exports = async (req, res) => {
  // Ensure method is POST before proceeding
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract form data from request body
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check if email exists in the database
    const result = await pool.query('SELECT * FROM user_reservation WHERE email = $1', [email]);

    if (result.rows.length === 1) {
      const user = result.rows[0];
      
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const secretKey = process.env.COOKIE_SECRET_KEY;
        
        const algorithm = 'aes-256-cbc';

      function encryptCookie(data) {
        const iv = crypto.randomBytes(16); // Generate a random initialization vector (IV)
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`; // Return IV and encrypted data
      }

      // Example usage
      const cookieValue = {
        userId: user.id,
        email: user.email,
        firstName: user.fname,
        lastName: user.lname,
        sbu: user.business_unit,
        branch: user.branch,
        usertype: user.user_type,
      };

      const encryptedCookieValue = encryptCookie(cookieValue);

      res.setHeader('Set-Cookie', cookie.serialize('user_data', encryptedCookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600,
        path: '/',
        sameSite: 'Strict',
      }));
        // Send success response
        res.status(200).json({ message: 'Welcome.' });
      } else {
        res.status(401).json({ error: 'Incorrect password.' });
      }
    } else {
      res.status(404).json({ error: 'Email not found.' });
    }

  } catch (error) {
    // Handle any errors that occur during database interaction
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
