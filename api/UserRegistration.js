const { Pool } = require("pg");
const bcrypt = require('bcryptjs');
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure this is correctly set in your Vercel environment
});

module.exports = async (req, res) => {
  // Ensure method is POST before proceeding
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract form data from request body
  const { fname, lname, email, password, confirmPassword, userType, sbu, branch, recaptchaResponse } = req.body;

  // Input validation
  if (!fname || !lname || !email || !password || !confirmPassword || !userType || !recaptchaResponse) {
    return res.status(400).json({ error: 'All fields are required, including reCAPTCHA.' });
  }

  // Verify reCAPTCHA response
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  const recaptchaVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaResponse}`;
  
  const recaptchaRes = await fetch(recaptchaVerifyURL, { method: 'POST' });
  const recaptchaData = await recaptchaRes.json();
  
  if (!recaptchaData.success) {
    return res.status(403).json({ error: 'reCAPTCHA verification failed.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  // Password validation: 
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.'
    });
  }

  try {
    // Check if email already exists in the database
    const result = await pool.query('SELECT * FROM user_reservation WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert user into the database with hashed password
    await pool.query(`
      INSERT INTO user_reservation (fname, lname, email, password, user_type, business_unit, branch)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [fname, lname, email, hashedPassword, userType, sbu, branch]);

    // Send success response
    res.status(200).json({ message: 'Registration successful.' });

  } catch (error) {
    // Handle any errors that occur during database interaction
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
