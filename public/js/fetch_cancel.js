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
            document.getElementById("bookingDetails").innerHTML = `<p>No booking found with ID: ${bookingID}</p>`;
            document.getElementById("cancelButton").style.display = "none";
            return;
        }

        const booking = bookings[0];

        // Ensure configData is available
        if (typeof configData === 'undefined') {
            console.error("configData is not defined");
            return;
        }

        const baseImageUrl = `https://raw.githubusercontent.com/${configData.owner}/${configData.repo}/main/room-photo/`;
        booking.room_image = `${baseImageUrl}${booking.room_id}.jpg`;

        // Populate input fields with booking details
        document.getElementById("fname").value = booking.fname || '';
        document.getElementById("lname").value = booking.lname || '';
        document.getElementById("reserve_date").value = booking.reserve_date || '';
        document.getElementById("time").value = booking.time || '';
        document.getElementById("setup").value = booking.setup || '';
        document.getElementById("businessunit").value = booking.business_unit || '';
        document.getElementById("guest").value = booking.guest || '';
        document.getElementById("contact").value = booking.contact || '';
        document.getElementById("email").value = booking.email || '';
        document.getElementById("message").value = booking.message || '';

        // Display the image if available
        if (booking.room_image) {
            document.getElementById("bookingDetails").innerHTML += `<img src="${booking.room_image}" alt="Room Image" />`;
        }

        // Additional hidden fields
        document.getElementById("roomID").value = booking.room_id || '';
        document.getElementById("roomName").value = booking.room_name || '';
        document.getElementById("roomPrices").value = booking.room_prices || '';

        // Show cancel button
        document.getElementById("cancelButton").style.display = "block";
    } catch (error) {
        console.error("Error fetching booking details:", error);
        alert("An error occurred while fetching booking details.");
    }
}
