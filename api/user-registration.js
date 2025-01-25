// const { Pool } = require("pg");
// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL,
// });

// const bcrypt = require("bcryptjs");

// module.exports = async (req, res) => {
//     if (req.method === 'POST') {
//     const { email, password, userType, sbu, branch, fname, lname } = req.body;

//     if (!email || !password || !userType || !fname || !lname) {
//         return res.status(400).json({ error: 'Missing required fields: email, password, userType, fname, and lname are required.' });
//     }

//     // Validate email before sending
//     if (!/\S+@\S+\.\S+/.test(email)) {
//         return res.status(400).json({ error: 'Invalid email address.' });
//       }

//     try {
//     // Check database connection and execute query
//     await pool.query('SELECT NOW()'); // Test the connection
  
//     const client = await pool.connect();

//         try {
//             const emailCheckQuery = 'SELECT * FROM user_reservation WHERE email = $1';
//             const emailCheckResult = await client.query(emailCheckQuery, [email]);

//             if (emailCheckResult.rows.length > 0) {
//                 return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
//             }

//             if (userType === 'FAST Employee') {
//                 if (!sbu || !branch) {
//                     return res.status(400).json({ error: 'SBU and Branch are required for FAST Employees.' });
//                 }
//             }

//             if (!password) {
//                 return res.status(400).json({ error: 'Password is required.' });
//             }

//             try{
//                 const hashedPassword = await bcrypt.hash(password, 10);
//                 const insertUserQuery  = `
//                 INSERT INTO user_reservation (fname, lname, email, password, user_type, business_unit, branch)
//                 VALUES ($1, $2, $3, $4, $5, $6, $7)
//                 RETURNING id;
//                 `;
//                 const insertResult = await client.query(insertUserQuery, [fname, lname, email, hashedPassword, userType, sbu || null, branch || null]);
            
//                 try{
//                     res.status(200).json({ message: 'Registration submitted successfully.' });
//                 }catch (error) {
//                     console.error('Error inserting user:', error);
//                     res.status(500).json({ error: `There was a problem inserting the user: ${error.message}` });
//                   }

//             }  catch (insertError) {
//                 console.error('Insert error:', insertError);
//                 res.status(500).json({ error: `Failed to insert user into the database: ${insertError.message}` });
//               } finally {
//                 client.release(); // Release the database client
//               }
//         } catch (error) {
//             console.error('Registration error:', error);
//             return res.status(500).json({ error: 'Internal server error. Please try again later.' });
//         }
//     } catch (dbError) {
//         console.error('Database connection error:', dbError);
//         res.status(500).json({ error: 'Database connection error.' });
//     }
//     } else {
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//       }
// };
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

  const { email, password, userType, sbu, branch, fname, lname } = req.body;

  // Validate required fields
  if (!email || !password || !userType || !fname || !lname) {
    return res.status(400).json({
      error: "Missing required fields: email, password, userType, fname, and lname are required.",
    });
  }

  // Validate email format
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  // Validate SBU and Branch for FAST Employees
  if (userType === "FAST Employee" && (!sbu || !branch)) {
    return res.status(400).json({
      error: "SBU and Branch are required for FAST Employees.",
    });
  }

  let client;
  try {
    client = await pool.connect();

    // Check if email already exists
    const emailCheckQuery = "SELECT * FROM user_reservation WHERE email = $1";
    const emailCheckResult = await client.query(emailCheckQuery, [email]);
    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists. Please use a different email." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
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

    // Respond with success and the new user ID
    res.status(200).json({
      message: "Booking submitted successfully.",
      userId: insertResult.rows[0].id,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    if (client) client.release(); // Ensure the database client is released
  }
};
