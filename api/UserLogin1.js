const { Pool } = require("pg");
const cookie = require('cookie');
const bcrypt = require('bcryptjs');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure this is correctly set in your Vercel environment
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password, recaptchaResponse } = req.body;

  if (!email || !password || !recaptchaResponse) {
    return res.status(400).json({ error: 'All fields are required, including reCAPTCHA.' });
  }

  try {

    // Verify reCAPTCHA response
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaResponse}`;
    
    const recaptchaRes = await fetch(recaptchaVerifyURL, { method: 'POST' });
    const recaptchaData = await recaptchaRes.json();
    
    if (!recaptchaData.success) {
      return res.status(403).json({ error: 'reCAPTCHA verification failed.' });
    }
    
    // Check if email exists in the database
    const result = await pool.query('SELECT * FROM user_reservation WHERE email = $1', [email]);

    if (result.rows.length === 1) {
      const user = result.rows[0];
      
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const secretKey = process.env.COOKIE_SECRET_KEY;
        
        // Select all data for the user (excluding sensitive information like the password)
        const cookieValue = {
          userId: user.id,  // Store the user ID in the cookie
          email: user.email,
          firstName: user.fname,
          lastName: user.lname,
          sbu: user.business_unit,
          branch: user.branch,
          usertype: user.user_type,
        };

        // Set the cookie to expire in 1 hour (3600000 milliseconds)
        res.setHeader('Set-Cookie', cookie.serialize('user_data', JSON.stringify(cookieValue), {
          httpOnly: true,  // Ensures the cookie can't be accessed via JavaScript
          secure: process.env.NODE_ENV === 'production',  // Only secure in production
          maxAge: 3600,  // Cookie will expire in 1 hour (3600 seconds)
          path: '/',  // Cookie is available for the entire domain
          sameSite: 'Strict',  // Prevents sending the cookie with cross-site requests
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
