async function fetchBookingDetails() {
    const bookingID = document.getElementById("bookingID").value;
  
    if (!bookingID) {
      alert("Please enter a booking ID.");
      return;
    }
  
    try {
      const response = await fetch(`/api/cancel?booking_id=${bookingID}`);
  
      if (!response.ok) {
        console.error(`Error response from server: ${response.status}`);
        throw new Error(`Server returned status ${response.status}`);
      }
  
      const bookings = await response.json();
  
      if (bookings.length === 0) {
        document.getElementById("bookingDetails").innerHTML = `
          <p>No booking found with ID: ${bookingID}</p>`;
        document.getElementById("cancelButton").style.display = "none";
      } else {
        const booking = bookings[0];
        document.getElementById("bookingDetails").innerHTML = `
          <p><strong>Booking ID:</strong> ${booking.booking_id}</p>
          <p><strong>Room Type:</strong> ${booking.room_type}</p>
          <p><strong>Booking Date:</strong> ${booking.booking_date}</p>`;
        document.getElementById("cancelButton").style.display = "block";
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      alert("An error occurred while fetching booking details.");
    }
  }
  