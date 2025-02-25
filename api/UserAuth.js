// const { Pool } = require("pg");
// const bcrypt = require('bcryptjs');
// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL, // Ensure this is correctly set in your Vercel environment
// });

// module.exports = async (req, res) => {
//   // Ensure method is POST before proceeding
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }

//   // Extract form data from request body
//   const { fname, lname, email, password, confirmPassword, userType, sbu, branch, recaptchaResponse } = req.body;

//   // Input validation
//   if (!fname || !lname || !email || !password || !confirmPassword || !userType || !recaptchaResponse) {
//     return res.status(400).json({ error: 'All fields are required, including reCAPTCHA.' });
//   }

//   // Verify reCAPTCHA response
//   const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
//   const recaptchaVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaResponse}`;
  
//   const recaptchaRes = await fetch(recaptchaVerifyURL, { method: 'POST' });
//   const recaptchaData = await recaptchaRes.json();
  
//   if (!recaptchaData.success) {
//     return res.status(403).json({ error: 'reCAPTCHA verification failed.' });
//   }

//   if (password !== confirmPassword) {
//     return res.status(400).json({ error: 'Passwords do not match.' });
//   }

//   // Validate email format
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return res.status(400).json({ error: 'Invalid email format.' });
//   }

//   const validatePassword = (password) => {
//       if (password.length < 8) {
//           return 'Password must be at least 8 characters long.';
//       }
//       if (!/[A-Z]/.test(password)) {
//           return 'Password must include at least one uppercase letter.';
//       }
//       if (!/[a-z]/.test(password)) {
//           return 'Password must include at least one lowercase letter.';
//       }
//       if (!/\d/.test(password)) {
//           return 'Password must include at least one number.';
//       }
//       if (!/[@$!%*?&]/.test(password)) {
//           return 'Password must include at least one special character (@$!%*?&).';
//       }
//       return null; // No errors
//   };

//   // Usage in your request handler
//   const passwordError = validatePassword(password);
//   if (passwordError) {
//       return res.status(400).json({ error: passwordError });
//   }

//   try {
//     // Check if email already exists in the database
//     const result = await pool.query('SELECT * FROM user_reservation WHERE email = $1', [email]);
//     if (result.rows.length > 0) {
//       return res.status(400).json({ error: 'Email already in use.' });
//     }

//     // Hash the password before storing it in the database
//     const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

//     // Insert user into the database with hashed password
//     await pool.query(`
//       INSERT INTO user_reservation (fname, lname, email, password, user_type, business_unit, branch)
//       VALUES ($1, $2, $3, $4, $5, $6, $7)
//     `, [fname, lname, email, hashedPassword, userType, sbu, branch]);

//     // Send success response
//     res.status(200).json({ message: 'Registration successful.' });

//   } catch (error) {
//     // Handle any errors that occur during database interaction
//     console.error('Error during registration:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
const { Pool } = require("pg");
const cookie = require('cookie');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = async (req, res) => {
  try {
    if (req.method === "POST") {
      const {
        email, password, recaptchaResponse,
        fname, lname, confirmPassword, userType, sbu, branch
      } = req.body;

      if (email && password && recaptchaResponse && !fname) {
        // **User Login Flow**
        return await handleUserLogin(req, res);
      } else if (fname && lname && email && password && confirmPassword && userType && recaptchaResponse) {
        // **User Registration Flow**
        return await handleUserRegistration(req, res);
      } else {
        return res.status(400).json({ error: "Invalid request. Please check the provided fields." });
      }
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error handling user authentication:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};

const handleUserLogin = async (req, res) => {
  const { email, password, recaptchaResponse } = req.body;

  if (!email || !password || !recaptchaResponse) {
    return res.status(400).json({ error: 'All fields are required, including reCAPTCHA.' });
  }

  try {
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaResponse}`;
    const recaptchaRes = await fetch(recaptchaVerifyURL, { method: 'POST' });
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success) {
      return res.status(403).json({ error: 'reCAPTCHA verification failed.' });
    }

    const result = await pool.query('SELECT * FROM user_reservation WHERE email = $1', [email]);

    if (result.rows.length === 1) {
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const cookieValue = {
          userId: user.id,
          email: user.email,
          firstName: user.fname,
          lastName: user.lname,
          sbu: user.business_unit,
          branch: user.branch,
          usertype: user.user_type,
        };

        res.setHeader('Set-Cookie', cookie.serialize('user_data', JSON.stringify(cookieValue), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600,
          path: '/',
          sameSite: 'Strict',
        }));

        res.status(200).json({ message: 'Welcome.' });
      } else {
        res.status(401).json({ error: 'Incorrect password.' });
      }
    } else {
      res.status(404).json({ error: 'Email not found.' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const handleUserRegistration = async (req, res) => {
  const { fname, lname, email, password, confirmPassword, userType, sbu, branch, recaptchaResponse } = req.body;

  if (!fname || !lname || !email || !password || !confirmPassword || !userType || !recaptchaResponse) {
    return res.status(400).json({ error: 'All fields are required, including reCAPTCHA.' });
  }

  try {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    const result = await pool.query('SELECT * FROM user_reservation WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(`
      INSERT INTO user_reservation (fname, lname, email, password, user_type, business_unit, branch)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [fname, lname, email, hashedPassword, userType, sbu, branch]);

    res.status(200).json({ message: 'Registration successful.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const validatePassword = (password) => {
  if (password.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter.';
  if (!/\d/.test(password)) return 'Password must include at least one number.';
  if (!/[@$!%*?&]/.test(password)) return 'Password must include at least one special character (@$!%*?&).';
  return null;
};
