async function fetchBookingDetails() {
    const reserveID = document.getElementById('reserveID').value.trim();

    if (!reserveID) {
        alert('Please enter a Reservation ID or Booking ID.');
        return;
    }

    try {
        // Query both reservation_id and booking_id
        const response = await fetch(`/api/fetch-booking-details?reservation_or_booking_id=${reserveID}`);
        const data = await response.json();

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error); // Show the error message in an alert
            return;
        }

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

            // Fetch the base image URL from GitHub
            const configResponse = await fetch('/api/fetch-image');
            if (configResponse.ok) {
                const configData = await configResponse.json();
                const baseImageUrl = `https://raw.githubusercontent.com/${configData.owner}/${configData.repo}/main/rooms/`;
                document.getElementById('roomImage').src = `${baseImageUrl}${booking.room_image}`;
            }

            // Calculate the difference between reserve_date and the current date
            const reserveDate = new Date(booking.reserve_date);
            const currentDate = new Date();
            const timeDifference = reserveDate.getTime() - currentDate.getTime();
            const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

            if (dayDifference > 1) {
                // Show the cancel button
                document.getElementById('cancelButton').style.display = 'inline-block';
                document.getElementById('cancelMessage').textContent = ''; // Clear any previous message
            } else {
                // Hide the cancel button and show the message
                document.getElementById('cancelButton').style.display = 'none';
                document.getElementById('cancelMessage').textContent = 'Reservation cannot be canceled as it is less than 1 day away.';
            }

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
