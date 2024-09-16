const { Pool } = require('pg');

// Create a new pool instance for PostgreSQL connection
const pool = new Pool({
  user: 'default',        // Your PostgreSQL username
  host: 'ep-wild-tree-a4wwmube-pooler.us-east-1.aws.neon.tech',             // Database host
  database: 'verceldb',     // Your database name
  password: 'N7EiwAoCcI0h',     // Your PostgreSQL password
  port: 5432,                    // PostgreSQL port (default is 5432)
});

// Verify the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
    return;
  }
  // Run a simple query to verify the connection
  client.query('SELECT NOW()', (err, result) => {
    release();  // Release the client back to the pool
    if (err) {
      console.error('Error executing query', err.stack);
      return;
    }
    console.log('Connected to PostgreSQL:', result.rows[0]);  // Log the result
  });
});

module.exports = pool;
