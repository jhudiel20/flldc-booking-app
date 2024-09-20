const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');  // Import the Pool class from 'pg'
const path = require('path');

// Create a new Pool instance with your PostgreSQL credentials
const pool = new Pool({
  user: 'default',  // Your PostgreSQL username
  host: 'ep-wild-tree-a4wwmube-pooler.us-east-1.aws.neon.tech',  // Database host
  database: 'verceldb',  // Your database name
  password: 'N7EiwAoCcI0h',  // Your PostgreSQL password
  port: 5432,  // PostgreSQL port (default: 5432)
  ssl: {
    rejectUnauthorized: false  // Allows insecure connections, but enables SSL
  }
});

// Verify the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
    return;
  }
  client.query('SELECT NOW()', (err, result) => {
    release();  // Release the client back to the pool
    if (err) {
      console.error('Error executing query', err.stack);
      return;
    }
    console.log('Connected to PostgreSQL:', result.rows[0]);
  });
});

// Initialize Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));  // Parse URL-encoded bodies

// Serve the HTML form
app.get('/rooms301', (req, res) => {
    res.sendFile(path.join(__dirname, 'rooms301.html'));  // Serve the HTML file
});

// Route to handle form submission
app.post('/rooms301', (req, res) => {
  const { reserve_date, businessunit, contact, email, table, hdmi, extension, message } = req.body;

  // Insert query
  const query = `
    INSERT INTO reservations (reserve_date, business_unit, contact, email, addons, message)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
  `;

  // Create string for addons (tables, hdmi, extension)
  const addons = [
    table ? 'Table' : '',
    hdmi ? 'HDMI cable' : '',
    extension ? 'Extension cord' : ''
  ].filter(Boolean).join(', ');  // Join selected addons as a string

  // Run the query
  pool.query(query, [reserve_date, businessunit, contact, email, addons, message], (err, result) => {
    if (err) {
      console.error('Error inserting data', err.stack);
      res.status(500).send('Error saving reservation');
    } else {
      console.log('Reservation saved:', result.rows[0]);
      res.send('Reservation successful');
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on https://flldc-booking-app.vercel.app/');
});
