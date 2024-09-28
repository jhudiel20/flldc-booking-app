// Import the required libraries (if using modules)
const { Pool } = require('pg');

// Create a new pool instance for the PostgreSQL database
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

// Function to fetch reserved dates and times based on the room
async function fetchReservedSlots(room) {
  try {
    const query = `
      SELECT reserve_date, time
      FROM reservations
      WHERE room = $1 AND reserve_status = 'APPROVED'
    `;
    const values = [room];

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error fetching reserved slots:', error);
    throw error;
  }
}

// Function to disable reserved dates and times
async function disableReservedDatesAndTimes(room) {
  const reservedSlots = await fetchReservedSlots(room);
  const reservedDates = new Set();
  const reservedTimes = new Set();

  // Collect reserved dates and times
  reservedSlots.forEach(slot => {
    reservedDates.add(slot.reserve_date);
    reservedTimes.add(slot.time);
  });

  // Disable reserved dates in the calendar
  const dateInput = document.getElementById('reserve_date');
  dateInput.addEventListener('change', function () {
    const selectedDate = this.value;
    if (reservedDates.has(selectedDate)) {
      alert(`The date ${selectedDate} is already reserved.`);
      dateInput.value = ''; // Reset the date input
    }
  });

  // Disable reserved times in the dropdown
  const timeSelect = document.getElementById('time');
  const options = timeSelect.options;
  for (let i = 0; i < options.length; i++) {
    if (reservedTimes.has(options[i].value)) {
      options[i].disabled = true; // Disable the reserved time options
    }
  }
}

// Call the function when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  const room = document.getElementById('room').value; // Get the room value
  disableReservedDatesAndTimes(room);
});