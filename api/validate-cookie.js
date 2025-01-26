const cookie = require('cookie');

// This function will handle both cookie validation and logout logic
module.exports = async (req, res) => {
  try {
    // Handle logout (when the method is POST and URL is /logout)
    if (req.method === 'POST' && req.url === '/api/logout') {
      // Set the cookie with maxAge 0 to delete it
      res.setHeader('Set-Cookie', cookie.serialize('user_data', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // Only secure in production
        maxAge: 0,  // Expire the cookie immediately
        path: '/',
        sameSite: 'Strict'
      }));

      // Send a response back to the client indicating logout success
      return res.status(200).json({ message: 'Logged out successfully' });
    }

    // Handle cookie validation (GET request for validation)
    const cookieHeader = req.headers.cookie || '';
    const userCookie = cookieHeader
      .split('; ')
      .find(row => row.startsWith('user_data='))
      ?.split('=')[1];

    if (userCookie) {
      // Parse the cookie value as it's a JSON string
      const userData = JSON.parse(decodeURIComponent(userCookie));

      // Return the parsed user data to the frontend
      return res.status(200).json(userData);
    }

    // If no cookie is found, return unauthorized
    return res.status(401).json({ error: 'Unauthorized' });
  } catch (error) {
    console.error('Error processing cookie:', error);
    return res.status(400).json({ error: 'Invalid cookie' });
  }
};
