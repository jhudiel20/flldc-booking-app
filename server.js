const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');  // This will trigger the connection test

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Other routes and logic
// ...

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
