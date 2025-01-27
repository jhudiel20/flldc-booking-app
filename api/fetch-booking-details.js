// const { Pool } = require("pg");
// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL,
// });

// module.exports = async (req, res) => {
//   try {
//     const { reservation_id } = req.query;

//     if (!reservation_id) {
//       console.error("Booking ID is missing in the request.");
//       return res.status(400).json({ error: "Booking ID is required." });
//     }

//     console.log(`Fetching booking details for ID: ${reservation_id}`);

//     // Query to join reservations and room_details, ensuring room_image is selected
//     const query = `
//       SELECT r.*, rd.room_photo,rd.usage,rd.capacity,rd.features,r.id,r.branch
//       FROM reservations r
//       JOIN room_details rd ON rd.room_id = r.roomid
//       WHERE r.reservation_id = $1 OR r.booking_id = $1
//     `;
//     const values = [reservation_id];

//     const result = await pool.query(query, values);

//     if (result.rows.length === 0) {
//       console.log(`No booking found for ID: ${reservation_id}`);
//       return res.status(404).json({ error: "No booking found." });
//     }

//     console.log(`Booking details fetched: ${JSON.stringify(result.rows)}`);
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error("Error fetching booking details:", error.message); // Log the actual error message
//     res.status(500).json({ error: `Server error: ${error.message}` }); // Send the error message to the client
//   }
// };
const { Pool } = require("pg");
const cookie = require("cookie");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

module.exports = async (req, res) => {
  try {
    // Extract the cookie from the request headers
    const cookieHeader = req.headers.cookie || "";
    const userCookie = cookieHeader
      .split("; ")
      .find((row) => row.startsWith("user_data="))
      ?.split("=")[1];

    if (!userCookie) {
      return res.status(401).json({ error: "Unauthorized: No user data found in cookies" });
    }

    // Parse the user data from the cookie
    const userData = JSON.parse(decodeURIComponent(userCookie));
    const userId = userData.userId; // Assuming 'ID' is the key for user_id in the cookie

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User ID not found in cookies" });
    }

    if (req.method === "GET") {
      const { searchParams } = new URL(req.url, `https://${req.headers.host}`);
      const queryLimit = searchParams.get("size") === "true" ? Number.MAX_SAFE_INTEGER : 40;
      const page = parseInt(searchParams.get("page") || "1", 10) - 1;
      const start = page * queryLimit;

      const sorters = searchParams.get("sort") ? JSON.parse(searchParams.get("sort")) : [];
      const filters = searchParams.get("filter") ? JSON.parse(searchParams.get("filter")) : [];

      let sortField = "date_created";
      let sortDir = "DESC";

      if (sorters.length > 0) {
        sortField = sorters[0].field || sortField;
        sortDir = sorters[0].dir || sortDir;
      }

      let filterClauses = [];
      let filterParams = [];
      let paramIndex = 2; // Start from 2 because userId is $1

      if (filters.length > 0) {
        for (const filter of filters) {
          if (filter.field && filter.value) {
            if (filter.field === "reserve_date") {
              filterClauses.push(`${filter.field} = $${paramIndex}`);
              filterParams.push(filter.value);
            } else {
              filterClauses.push(`${filter.field} ILIKE $${paramIndex}`);
              filterParams.push(`%${filter.value}%`);
            }
            paramIndex++;
          }
        }
      }

      const filterSQL = filterClauses.length > 0 ? `AND ${filterClauses.join(" AND ")}` : "";

      // Get total record count
      const countQuery = `
        SELECT COUNT(*) AS count 
        FROM reservations 
        WHERE user_id = $1 ${filterSQL}`;
      const countResult = await pool.query(countQuery, [userId, ...filterParams]);
      const totalQuery = parseInt(countResult.rows[0].count, 10);
      const totalPages = totalQuery > 0 ? Math.ceil(totalQuery / queryLimit) : 1;

      // Get paginated data
      const dataQuery = `
        SELECT *,
               TO_CHAR(reservations.date_created, 'YYYY-MM-DD HH12:MI:SS AM') AS date_created
        FROM reservations 
        WHERE user_id = $1 ${filterSQL} 
        ORDER BY ${sortField} ${sortDir}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      filterParams.push(queryLimit, start);

      const dataResult = await pool.query(dataQuery, [userId, ...filterParams]);

      // Send JSON response
      const response = {
        last_page: totalPages,
        total_record: totalQuery,
        data: dataResult.rows,
      };

      return res.status(200).json(response);
    } else {
      return res.status(404).json({ error: "Not Found" });
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
