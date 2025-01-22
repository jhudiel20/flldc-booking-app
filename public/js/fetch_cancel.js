async function fetchBookingDetails() {
    const bookingID = document.getElementById('bookingID').value;
    try {
        const response = await fetch(`/api/fetch-booking-details?booking_id=${bookingID}`);
        const data = await response.json();

        // Check if the data contains a booking
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
            document.getElementById('roomNameView').text = booking.room;
            document.getElementById('roomPrices').value = booking.prices;
            document.getElementById('usage').text = booking.usage;
            document.getElementById('features').text = booking.features;
            document.getElementById('capacity').text = booking.capacity;

            // Show the booking form and hide the booking details
            document.getElementById('bookingForm').style.display = 'block';
        } else {
            // No booking found
            document.getElementById('bookingDetails').innerHTML = 'Booking not found.';
            document.getElementById('bookingForm').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching booking details:', error);
        document.getElementById('bookingDetails').innerHTML = 'An error occurred while fetching booking details.';
        document.getElementById('bookingForm').style.display = 'none';
    }
}
