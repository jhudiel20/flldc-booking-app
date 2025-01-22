async function cancelReservation() {
    const reservationId = document.getElementById("ID").value;
  
    if (!reservationId) {
      alert("Please enter a Reservation ID.");
      return;
    }
  
    try {
      const response = await fetch(`/api/cancelReservation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservation_id: reservationId }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message || "Reservation cancelled successfully.");
        console.log("Cancelled Reservation:", result.data);
      } else {
        alert(result.error || "Failed to cancel the reservation.");
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      alert("An error occurred while cancelling the reservation. Please try again.");
    }
}
  
  
function checkCancellationEligibility(reserveDate) {
    const cancelButton = document.getElementById('cancelButton');
    const cancelMessage = document.getElementById('cancelMessage');

    // Parse the reserve_date into a Date object
    const reservationDate = new Date(reserveDate);
    const currentDate = new Date();

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

// async function fetchBookingDetails() {
//     const reserveID = document.getElementById('reserveID').value.trim();

//     if (!reserveID) {
//         alert('Please enter a Reservation ID or Booking ID.');
//         return;
//     }

//     try {
//         // Query the server
//         const response = await fetch(`/api/fetch-booking-details?reservation_id=${reserveID}`);

//         // Read the response body once
//         const responseBody = await response.json(); // This will throw an error if the response is not in JSON format

//         if (!response.ok) {
//             // Handle errors
//             alert(responseBody.error || 'An error occurred while fetching booking details.');
//             return;
//         }

//         const data = responseBody;

//         if (Array.isArray(data) && data.length > 0) {
//             const booking = data[0]; // Access the first booking in the array

//             // Populate the form fields with the booking details
//             document.getElementById('reserve_status').textContent = booking.reserve_status;
//             // document.getElementById('ID').value = booking.id;
//             document.getElementById('fname').value = booking.fname;
//             document.getElementById('lname').value = booking.lname;
//             document.getElementById('reserve_date').value = booking.reserve_date.split('T')[0]; // Extract the date
//             document.getElementById('time').value = booking.time;
//             document.getElementById('setup').value = booking.setup;
//             document.getElementById('businessunit').value = booking.business_unit;
//             document.getElementById('guest').value = booking.guest;
//             document.getElementById('contact').value = booking.contact;
//             document.getElementById('email').value = booking.email;
//             document.getElementById('message').value = booking.message;
//             document.getElementById('roomID').value = booking.roomid;
//             document.getElementById('roomNameView').textContent = booking.room;
//             document.getElementById('roomPrices').value = booking.prices;
//             document.getElementById('usage').textContent = booking.usage;
//             document.getElementById('features').textContent = booking.features;
//             document.getElementById('capacity').textContent = booking.capacity;

//             // Fetch the base image URL from GitHub
//             const configResponse = await fetch('/api/fetch-image');
//             if (configResponse.ok) {
//                 const configData = await configResponse.json();
//                 baseImageUrl = `https://raw.githubusercontent.com/${configData.owner}/${configData.repo}/main/room-photo/`;
//             } else {
//                 console.error('Failed to fetch config');
//             }

//             // Set the image source dynamically
//             const roomImageUrl = `${baseImageUrl}${booking.room_photo}`; // Assuming the image name is based on roomid
//             document.getElementById('roomImage').src = roomImageUrl;

//             // Show the booking form
//             document.getElementById('bookingForm').style.display = 'block';
//             checkCancellationEligibility(booking.reserve_date);
//         } else {
//             alert('No reservation found with the provided ID.');
//             document.getElementById('bookingForm').style.display = 'none';
//         }
//     } catch (error) {
//         console.error('Error fetching booking details:', error);
//         alert('An error occurred while fetching booking details. Please try again later.');
//     }
// }

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
        const responseBody = await response.json(); // This will throw an error if the response is not in JSON format

        if (!response.ok) {
            // Handle errors
            alert(responseBody.error || 'An error occurred while fetching booking details.');
            return;
        }

        const data = responseBody;

        if (Array.isArray(data) && data.length > 0) {
            const booking = data[0]; // Access the first booking in the array

            // Populate the form fields with the booking details
            const elementsToUpdate = [
                { id: 'reserve_status', value: booking.reserve_status },
                { id: 'fname', value: booking.fname },
                { id: 'lname', value: booking.lname },
                { id: 'reserve_date', value: booking.reserve_date.split('T')[0] }, // Extract the date
                { id: 'time', value: booking.time },
                { id: 'setup', value: booking.setup },
                { id: 'businessunit', value: booking.business_unit },
                { id: 'guest', value: booking.guest },
                { id: 'contact', value: booking.contact },
                { id: 'email', value: booking.email },
                { id: 'message', value: booking.message },
                { id: 'roomID', value: booking.roomid },
                { id: 'roomPrices', value: booking.prices },
                { id: 'usage', value: booking.usage },
                { id: 'features', value: booking.features },
                { id: 'capacity', value: booking.capacity },
            ];

            elementsToUpdate.forEach(item => {
                const element = document.getElementById(item.id);
                if (element) {
                    element.value = item.value; // Only update if element exists
                } else {
                    console.warn(`Element with id '${item.id}' not found.`);
                }
            });

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
            const roomImageElement = document.getElementById('roomImage');
            if (roomImageElement) {
                roomImageElement.src = roomImageUrl;
            } else {
                console.warn("Element with id 'roomImage' not found.");
            }

            // Show the booking form
            document.getElementById('bookingForm').style.display = 'block';
            checkCancellationEligibility(booking.reserve_date);
        } else {
            alert('No reservation found with the provided ID.');
            document.getElementById('bookingForm').style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching booking details:', error);
        alert('An error occurred while fetching booking details. Please try again later.');
    }
}
