// api/fetch-booking-details.js
const { Pool } = require('pg');

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL, // Ensure this is set in your Vercel environment variables
});

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { userid } = req.query; // Retrieve user ID from query parameters
      if (!userid) {
        return res.status(401).json({ error: 'User ID is required' });
      }

      const searchParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
      const queryLimit = searchParams.get('size') === 'true' ? Number.MAX_SAFE_INTEGER : 40;
      const page = parseInt(searchParams.get('page') || '1', 10) - 1;
      const start = page * queryLimit;

      const sorters = searchParams.get('sort') ? JSON.parse(searchParams.get('sort')) : [];
      const filters = searchParams.get('filter') ? JSON.parse(searchParams.get('filter')) : [];

      let sortField = 'date_created';
      let sortDir = 'DESC';

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
            if (filter.field === 'reserve_date') {
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

      const filterSQL = filterClauses.length > 0 ? `AND ${filterClauses.join(' AND ')}` : '';

      // Get total record count
      const countQuery = `
        SELECT COUNT(*) AS count 
        FROM reservations 
        WHERE user_id = $1 ${filterSQL}`;
      const countResult = await pool.query(countQuery, [userid, ...filterParams]);
      const totalQuery = parseInt(countResult.rows[0].count, 10);
      const totalPages = totalQuery > 0 ? Math.ceil(totalQuery / queryLimit) : 1;

      // Get paginated data
      const dataQuery = `
        SELECT *,TO_CHAR(reserve_date, 'YYYY-MM-DD') AS reserve_date ,TO_CHAR(date_created, 'YYYY-MM-DD') AS date_created
        FROM reservations 
        WHERE user_id = $1 ${filterSQL} 
        ORDER BY ${sortField} ${sortDir}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      filterParams.push(queryLimit, start);

      const dataResult = await pool.query(dataQuery, [userid, ...filterParams]);

      // Send JSON response
      const response = {
        last_page: totalPages,
        total_record: totalQuery,
        data: dataResult.rows,
      };

      return res.status(200).json(response);
    } else {
      return res.status(404).json({ error: 'Not Found' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
