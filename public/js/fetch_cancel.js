// Fetch and display booking details
async function fetchBookingDetails() {
    const bookingID = document.getElementById("bookingID").value;
  
    if (!bookingID) {
      alert("Please enter a booking ID.");
      return;
    }
  
    try {
      // Call the backend API
      const response = await fetch(`/api/cancel.js?booking_id=${bookingID}`);
      if (!response.ok) {
        throw new Error("Failed to fetch booking details.");
      }
  
      const bookings = await response.json();
  
      // Display booking details
      const bookingDetailsDiv = document.getElementById("bookingDetails");
      if (bookings.length === 0) {
        bookingDetailsDiv.innerHTML = `<p>No booking found with ID: ${bookingID}</p>`;
        document.getElementById("cancelButton").style.display = "none";
      } else {
        const booking = bookings[0]; // Assuming one result per ID
        bookingDetailsDiv.innerHTML = `
          <p><strong>Booking ID:</strong> ${booking.booking_id}</p>
          <p><strong>Room Type:</strong> ${booking.room_type}</p>
          <p><strong>Booking Date:</strong> ${booking.booking_date}</p>
        `;
        document.getElementById("cancelButton").style.display = "block";
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      alert("An error occurred while fetching booking details.");
    }
  }
  