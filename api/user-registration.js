const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure this is set correctly in your Vercel environment
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Destructure fields from the request body
  const { email, password, userType, sbu, branch, fname, lname } = req.body;

  try {
    client = await pool.connect();
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Insert user into the database
    const insertUserQuery = `
      INSERT INTO user_reservation (fname, lname, email, password, user_type, business_unit, branch)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;
    const insertResult = await client.query(insertUserQuery, [
      fname,
      lname,
      email,
      hashedPassword,
      userType,
      sbu || null,
      branch || null,
    ]);
  
    // Success response
    return res.status(200).json({
      message: "Registration successful.",
      userId: insertResult.rows[0].id,
    });
  } catch (error) {
    console.error("Error during registration:", error); // Logs detailed error
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (client) client.release();
  }
  
};

