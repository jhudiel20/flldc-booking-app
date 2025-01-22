async function fetchBookingDetails() {
    const bookingID = document.getElementById("bookingID").value;

    // Make the AJAX request to fetch booking details based on the booking ID
    try {
        const response = await fetch(`/api/fetch-booking-details?booking_id=${bookingID}`);
        const data = await response.json();

        if (response.ok && data.success) {
            // Populate the form with the fetched data
            document.getElementById("fname").value = data.booking.first_name;
            document.getElementById("lname").value = data.booking.last_name;
            document.getElementById("reserve_date").value = data.booking.reserve_date;
            document.getElementById("time").value = data.booking.time;
            document.getElementById("setup").value = data.booking.setup;
            document.getElementById("businessunit").value = data.booking.businessunit;
            document.getElementById("guest").value = data.booking.guest;
            document.getElementById("contact").value = data.booking.contact;
            document.getElementById("email").value = data.booking.email;
            document.getElementById("message").value = data.booking.message;

            // Populate hidden fields
            document.getElementById("roomID").value = data.booking.roomID;
            document.getElementById("roomName").value = data.booking.roomName;
            document.getElementById("roomPrices").value = data.booking.roomPrices;

            // Display the booking form and cancel button
            document.getElementById("bookingForm").style.display = 'block';
            document.getElementById("cancelButton").style.display = 'block';
        } else {
            alert('Booking not found or an error occurred.');
        }
    } catch (error) {
        console.error('Error fetching booking details:', error);
    }
}
