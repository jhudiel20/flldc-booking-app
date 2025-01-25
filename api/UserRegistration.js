const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure this is correctly set in your Vercel environment
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { fname, lname, email, password, userType, sbu, branch } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(`
    INSERT INTO user_reservation (fname, lname, email, password, user_type, business_unit, branch)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [fname, lname, email, branch, hashedPassword, userType, sbu, branch]);

  res.status(200).json({ message: "User registered successfully." });
};
