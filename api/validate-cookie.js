const { decryptCookie } = require('./encryption-key'); // Adjust path if needed
const cookie = require('cookie');

module.exports = async (req, res) => {
  try {
    const cookieHeader = req.headers.cookie || '';
    const userCookie = cookieHeader
      .split('; ')
      .find(row => row.startsWith('user_data='))
      ?.split('=')[1];

    if (userCookie) {
      const decryptedData = decryptCookie(decodeURIComponent(userCookie));
      return res.status(200).json(decryptedData); // Return decrypted user data
    }

    res.status(401).json({ error: 'Unauthorized' });
  } catch (error) {
    console.error('Error validating cookie:', error);
    res.status(400).json({ error: 'Invalid cookie' });
  }
};
