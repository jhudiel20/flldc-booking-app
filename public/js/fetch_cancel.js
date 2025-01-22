async function fetchBookingDetails() {
    const reserveID = document.getElementById('reserveID').value.trim();

    if (!reserveID) {
        alert('Please enter a Reservation ID or Booking ID.');
        return;
    }

    try {
        // Query the server
        const response = await fetch(`/api/fetch-booking-details?reservation_id=${reserveID}`);

        // Read the response body once
        const responseBody = await response.json();

        if (!response.ok) {
            // Handle errors
            alert(responseBody.error || 'An error occurred while fetching booking details.');
            return;
        }

        const data = responseBody;

        if (data && data.length > 0) {
            const booking = data[0]; // Access the first booking in the array

            // Populate the form fields with the booking details
            document.getElementById('fname').value = booking.fname;
            document.getElementById('lname').value = booking.lname;
            document.getElementById('reserve_date').value = booking.reserve_date.split('T')[0]; // Extract the date
            document.getElementById('time').value = booking.time;
            document.getElementById('setup').value = booking.setup;
            document.getElementById('businessunit').value = booking.business_unit;
            document.getElementById('guest').value = booking.guest;
            document.getElementById('contact').value = booking.contact;
            document.getElementById('email').value = booking.email;
            document.getElementById('message').value = booking.message;
            document.getElementById('roomID').value = booking.roomid;
            document.getElementById('roomNameView').textContent = booking.room;
            document.getElementById('roomPrices').value = booking.prices;
            document.getElementById('usage').textContent = booking.usage;
            document.getElementById('features').textContent = booking.features;
            document.getElementById('capacity').textContent = booking.capacity;

            // Show the booking form
            document.getElementById('bookingForm').style.display = 'block';
        } else {
            alert('No reservation found with the provided ID.');
            document.getElementById('bookingForm').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching booking details:', error);
        alert('An error occurred while fetching booking details. Please try again later.');
    }
}
