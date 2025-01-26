const { Pool } = require("pg");
const cookie = require('cookie');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure this is correctly set in your Vercel environment
});

// Login handler
export const loginHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const result = await pool.query('SELECT * FROM user_reservation WHERE email = $1', [email]);

    if (result.rows.length === 1) {
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const secretKey = process.env.COOKIE_SECRET_KEY;
        
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

// Registration handler
export const registrationHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { fname, lname, email, password, confirmPassword, userType, sbu, branch } = req.body;

  if (!fname || !lname || !email || !password || !confirmPassword || !userType) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.'
    });
  }

  try {
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

export const logoutHandler = async (req, res) => {
    try {
      if (req.method === 'POST') {
        res.setHeader('Set-Cookie', cookie.serialize('user_data', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 0, // Expire the cookie immediately
          path: '/',
          sameSite: 'Strict',
        }));
  
        return res.status(200).json({ message: 'Logged out successfully' });
      } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
      }
    } catch (error) {
      console.error('Error during logout:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const validateCookieHandler = async (req, res) => {
    try {
      const cookieHeader = req.headers.cookie || '';
      const userCookie = cookieHeader
        .split('; ')
        .find(row => row.startsWith('user_data='))
        ?.split('=')[1];
  
      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie));
        return res.status(200).json(userData);
      }
  
      return res.status(401).json({ error: 'Unauthorized' });
    } catch (error) {
      console.error('Error processing cookie:', error);
      return res.status(400).json({ error: 'Invalid cookie' });
    }
};
  


// // Main handler that determines which function to call
// export default async function handler(req, res) {
//     const { url } = req;
  
//     if (url === '/api/UserLogin') {
//       return loginHandler(req, res);
//     } else if (url === '/api/UserRegistration') {
//       return registrationHandler(req, res);
//     } else if (url === '/api/logout' && method === 'POST') {
//         return logoutHandler(req, res);
//     } else if (url === '/api/validateCookie' && method === 'GET') {
//         return validateCookieHandler(req, res);
//     } else {
//       res.status(404).json({ message: 'Not Found' });
//     }
//   }