async function fetchBookingDetails() {
    const bookingID = document.getElementById("bookingID").value;

    if (!bookingID) {
        alert("Please enter a booking ID.");
        return;
    }

    let baseImageUrl = '';  // Declare baseImageUrl outside the try block

    // Fetch the configuration for the image URL
    try {
        const configResponse = await fetch('/api/fetch-image');
        if (configResponse.ok) {
            const configData = await configResponse.json();
            baseImageUrl = `https://raw.githubusercontent.com/${configData.owner}/${configData.repo}/main/room-photo/`;
        } else {
            console.error('Failed to fetch config');
            alert("Failed to fetch image configuration.");
            return; // Exit the function if config fetch fails
        }
    } catch (error) {
        console.error('Error fetching config:', error);
        alert("An error occurred while fetching image configuration.");
        return; // Exit the function if an error occurs
    }

    try {
        const response = await fetch(`/api/cancel?booking_id=${bookingID}`);

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error(`Error response from server: ${response.status}`, errorDetails);
            throw new Error(`Server returned status ${response.status}: ${errorDetails.error || 'Unknown error'}`);
        }

        const bookings = await response.json();

        if (bookings.length === 0) {
            document.getElementById("bookingDetails").innerHTML = `<p>No booking found with ID: ${bookingID}</p>`;
            document.getElementById("cancelButton").style.display = "none";
            return;
        }

        const booking = bookings[0];

        // Use the fetched baseImageUrl to set the room image
        const roomImageUrl = `${baseImageUrl}${booking.room_id}.jpg`;

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

        // Additional hidden fields
        document.getElementById("roomID").value = booking.room_id || '';
        document.getElementById("roomName").value = booking.room_name || '';
        document.getElementById("roomPrices").value = booking.room_prices || '';

        // Display the image
        const imageElement = document.createElement("img");
        imageElement.src = roomImageUrl;
        imageElement.alt = "Room Image";
        imageElement.classList.add("img-fluid");  // Optional, for responsive images
        document.getElementById("bookingDetails").appendChild(imageElement);

        // Show cancel button
        document.getElementById("cancelButton").style.display = "block";
    } catch (error) {
        console.error("Error fetching booking details:", error);
        alert(`An error occurred while fetching booking details: ${error.message}`);
    }
}
