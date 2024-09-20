const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/rooms301', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'rooms301.html'));
});

// Use the reservation routes
app.use(reservationRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
