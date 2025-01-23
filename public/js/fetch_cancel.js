document.getElementById('cancelButton').addEventListener('click', function () {
    Swal.fire({
        title: 'Confirm Cancellation',
        text: 'Are you sure you want to cancel this reservation?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Cancel',
        cancelButtonText: 'Close',
        customClass: {
            confirmButton: 'btn btn-danger me-3', // Add spacing between buttons
            cancelButton: 'btn btn-secondary'
        },
        buttonsStyling: false // Disable default SweetAlert2 button styles
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const success = await cancelReservation(); // Call the async function
                if (success) {
                    Swal.fire('Cancelled!', 'Your reservation has been cancelled.', 'success');
                    await fetchBookingDetails();
                } else {
                    Swal.fire('Failed!', 'Failed to cancel the reservation. Please try again.', 'error');
                }
            } catch (error) {
                Swal.fire('Error!', 'An error occurred. Please try again later.', 'error');
            }
        }
    });
});

// Async function for canceling the reservation
async function cancelReservation() {
    const reservationId = document.getElementById("reserveID").value;

    if (!reservationId) {
        Swal.fire('Error!', 'Please enter a Reservation ID.', 'error');
        return false; // Indicate failure
    }

    try {
        const response = await fetch(`/api/cancelReservation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reservation_id: reservationId }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log("Cancelled Reservation:", result.data);
            return true; // Indicate success
        } else {
            console.error("Failed to cancel reservation:", result.error);
            Swal.fire('Error!', result.error || 'Failed to cancel the reservation.', 'error');
            return false; // Indicate failure
        }
    } catch (error) {
        console.error("Error cancelling reservation:", error);
        Swal.fire('Error!', 'An error occurred while cancelling the reservation. Please try again.', 'error');
        return false; // Indicate failure
    }
}

  
  
function checkCancellationEligibility(reserveDate,reserve_status) {
    const cancelButton = document.getElementById('cancelButton');
    const cancelMessage = document.getElementById('cancelMessage');

    // Parse the reserve_date into a Date object
    const reservationDate = new Date(reserveDate);
    const currentDate = new Date();

    if(reserve_status === 'CANCELLED') {
        cancelMessage.style.display = 'none';
        cancelButton.style.display = 'none';
    }else{ 
        // Calculate the difference in days
        const diffInTime = reservationDate - currentDate;
        const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24));

        if (diffInDays > 1) {
            // Show the Cancel Booking button if more than 1 day away
            cancelButton.style.display = 'block';
            cancelMessage.style.display = 'none';
        } else {
            // Show the message if 1 day or less
            cancelButton.style.display = 'none';
            cancelMessage.style.display = 'block';
        }
    }
}

async function fetchBookingDetails() {
    
    const reserveID = document.getElementById('reserveID').value.trim();

    if (!reserveID) {
        Swal.fire('Error!', 'Please enter a Reservation ID or Booking ID.', 'error');
        return;
    }
    const loader = document.getElementById('loader');
    loader.classList.add('show');
    try {
        // Query the server
        const response = await fetch(`/api/fetch-booking-details?reservation_id=${reserveID}`);

        // Read the response body once
        const responseBody = await response.json(); // This will throw an error if the response is not in JSON format

        if (!response.ok) {
            // Handle errors
            Swal.fire('Error!', responseBody.error || 'An error occurred while fetching booking details.', 'error');
            return;
        }

        const data = responseBody;

        if (Array.isArray(data) && data.length > 0) {
            const booking = data[0]; // Access the first booking in the array

            // Populate the form fields with the booking details
            // document.getElementById('reserve_status').textContent = booking.reserve_status;
            // Populate the form fields with the booking details
            const reserveStatusElement = document.getElementById('reserve_status');
            reserveStatusElement.textContent = booking.reserve_status;

            // Change the color based on the status
            if (booking.reserve_status === 'DECLINED') {
                reserveStatusElement.style.color = 'red'; // Set color to red for DECLINED
            } else if (booking.reserve_status === 'APPROVED') {
                reserveStatusElement.style.color = 'green'; // Set color to green for APPROVED
            } else if (booking.reserve_status === 'CANCELLED') {
                reserveStatusElement.style.color = 'red'; // Set color to red for CANCELLED
            }
            
            // document.getElementById('id').value = booking.id;
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
            // document.getElementById('roomID').value = booking.roomid;
            document.getElementById('roomNameView').textContent = booking.room;
            document.getElementById('roomPrices').value = booking.prices;
            document.getElementById('usage').textContent = booking.usage;
            document.getElementById('features').textContent = booking.features;
            document.getElementById('capacity').textContent = booking.capacity;

            // Fetch the base image URL from GitHub
            const configResponse = await fetch('/api/fetch-image');
            if (configResponse.ok) {
                const configData = await configResponse.json();
                baseImageUrl = `https://raw.githubusercontent.com/${configData.owner}/${configData.repo}/main/room-photo/`;
            } else {
                console.error('Failed to fetch config');
            }

            // Set the image source dynamically
            const roomImageUrl = `${baseImageUrl}${booking.room_photo}`; // Assuming the image name is based on roomid
            document.getElementById('roomImage').src = roomImageUrl;

            // Show the booking form
            document.getElementById('bookingForm').style.display = 'block';
            checkCancellationEligibility(booking.reserve_date,booking.reserve_status);
            loader.classList.remove('show');
        } else {
            Swal.fire({
                title: 'No Reservation Found',
                text: 'No reservation found with the provided ID.',
                icon: 'error',
                confirmButtonText: 'Okay'
            });
            document.getElementById('bookingForm').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching booking details:', error);
        Swal.fire({
            title: 'Error',
            text: 'An error occurred while fetching booking details. Please try again later..',
            icon: 'error',
            confirmButtonText: 'Okay'
        });
        loader.classList.remove('show');
    } finally {
        // Hide the loader after the process is done
        loader.classList.remove('show');  // Hide the loader
    }
}

