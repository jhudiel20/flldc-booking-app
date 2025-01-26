const cookie = require('cookie');

module.exports = async (req, res) => {
  try {
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
    res.status(401).json({ error: 'Unauthorized' });
  } catch (error) {
    console.error('Error validating cookie:', error);
    res.status(400).json({ error: 'Invalid cookie' });
  }
};
