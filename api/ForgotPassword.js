const { Pool } = require('pg');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

const logoPath = path.join(__dirname, '../public/images/LOGO.png');

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
    if (req.method === "POST") {
      const { email, token, newPassword } = req.body;

      if (email && token && newPassword) {
        // **Change Password Flow**
        return await handleChangePassword(req, res);
      } else if (email) {
        // **Forgot Password Flow**
        return await handleForgotPassword(req, res);
      } else {
        return res.status(400).json({ error: "Invalid request" });
      }
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error handling forgot/reset password:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};


async function handleForgotPassword(req, res) {

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
      UPDATE user_reservation SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3
    `;
    await pool.query(updateQuery, [hashedToken, expiryTime, user.id]);

    // Generate a reset link
    const resetLink = `https://flldc-booking-app.vercel.app?reset=true&token=${resetToken}&email=${email}`;

    // Send email
    const PasswordResetEmail = { 
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="background:#f3f3f3">
          <div style="margin:0px auto;max-width:640px;background:transparent">
            <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:transparent" align="center" border="0">
              <tbody>
                <tr>
                  <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 0px">
                    <div style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%">
                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="word-break:break-word;font-size:0px;padding:0px" align="center">
                              <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-spacing:0px" align="center" border="0">
                                <tbody>
                                  <tr>
                                    <td style="width:138px">
                                      <img alt="" title="" height="100px" width="200px" src="cid:logo_cid" style="">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="max-width:640px;margin:0 auto;border-radius:4px;overflow:hidden">
            <div style="margin:0px auto;max-width:640px;background:#fdfdfd">
              <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0px;width:100%;background:#fdfdfd" align="center" border="0">
                <tbody>
                  <tr>
                    <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:40px 50px">
                      <div style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%">
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="word-break:break-word;font-size:0px;padding:0px" align="left">
                                <div style="color:#737f8d;font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-size:16px;line-height:24px;text-align:left">
                                  <h2 style="font-family:Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif;font-weight:500;font-size:20px;color:#4f545c;letter-spacing:0.27px">Hi,</h2>
                                  <p>You requested a password reset. Click the button below to reset your password:</p>
                                  <p style="text-align:center; margin-top: 20px;">
                                    <a href="${resetLink}" style="background-color:#007bff;color:white;padding:12px 24px;text-align:center;text-decoration:none;border-radius:4px;font-size:16px;display:inline-block">Reset Password</a>
                                  </p>
                                  <p>This link will expire in 1 day.</p>
                                  <p>If you did not request this, please ignore this email.</p>
                                  <p style="text-align:justify">If you need assistance, feel free to contact us at jppsolis@fast.com.ph | Viber Number: +63 969 450 9412.</p>
                                  <p style="text-align:justify">Thank you for using FAST Learning and Development Center.</p>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td style="word-break:break-word;font-size:0px;padding:30px 0px">
                                <p style="font-size:1px;margin:0px auto;border-top:1px solid #dcddde;width:100%"></p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table align="center">
                <tr>
                  <td style="height:150px; border:none;border-radius:3px;color:black;padding:15px 19px" align="center" valign="middle">&copy; 2024-2025 <strong><span>FAST Learning and Development Center</span></strong></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'LOGO.png',
          path: logoPath, // Path to the logo image
          cid: 'logo_cid' // The 'cid' should match the embedded image's "src"
        }
      ]
    };
    

    await transporter.sendMail(PasswordResetEmail);
    return res.status(200).json({ message: 'Password reset link sent to your email.' });
};

// **Change Password Handler**
async function handleChangePassword(req, res) {
  const { email, token, newPassword } = req.body;

   // ✅ Validate new password inside the function
   if (newPassword.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long." });
  }
  if (!/[A-Z]/.test(newPassword)) {
    return res.status(400).json({ error: "Password must include at least one uppercase letter." });
  }
  if (!/[a-z]/.test(newPassword)) {
    return res.status(400).json({ error: "Password must include at least one lowercase letter." });
  }
  if (!/\d/.test(newPassword)) {
    return res.status(400).json({ error: "Password must include at least one number." });
  }
  if (!/[@$!%*?&]/.test(newPassword)) {
    return res.status(400).json({ error: "Password must include at least one special character (@$!%*?&)." });
  }

  // Find the user
  const userQuery = "SELECT id, reset_token, reset_token_expiry FROM user_reservation WHERE email = $1";
  const userResult = await pool.query(userQuery, [email]);

  if (userResult.rows.length === 0) {
    return res.status(404).json({ error: "Invalid or expired token" });
  }

  const user = userResult.rows[0];

  // Check if token has expired
  if (new Date() > new Date(user.reset_token_expiry)) {
    return res.status(400).json({ error: "Token has expired" });
  }

  if (user.reset_token_expiry === 'NULL') {
    return res.status(400).json({ error: "Token has already been used. Please request password request again!" });
  }

  // Verify the reset token
  const tokenIsValid = await bcrypt.compare(token, user.reset_token);
  if (!tokenIsValid) {
    return res.status(400).json({ error: "Invalid token" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and clear the reset token
  const updateQuery = "UPDATE user_reservation SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2";
  await pool.query(updateQuery, [hashedPassword, user.id]);

  return res.status(200).json({ message: "Password changed successfully." });
}



