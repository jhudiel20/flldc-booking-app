const { Pool } = require('pg');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// Transporter for sending emails
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if the email exists
    const userQuery = 'SELECT id, email FROM user_reservation WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Save the token in the database with an expiry time (1 hour)
    // const expiryTime = new Date(Date.now() + 3600000); // 1 hour from now
    const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from now
    const updateQuery = `
      UPDATE user_reservation SET ResetToken = $1, ResetTime = $2 WHERE id = $3
    `;
    await pool.query(updateQuery, [hashedToken, expiryTime, user.id]);

    // Generate a reset link
    const resetLink = `https://yourwebsite.com?reset=true&token=${resetToken}&email=${email}`;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>Hi,</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Error handling forgot password:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
};
