

document.addEventListener('DOMContentLoaded', function () {
    const bookingForm = document.getElementById('bookingForm');
    const reserveDateInput = document.getElementById('reserve_date');
    const timeSelect = document.getElementById('time');
    const reserveNowButton = document.getElementById('submit');
    const originalTimeHTML = timeSelect.outerHTML; // Store the original HTML of the time select

    // Event listener for date change
    reserveDateInput.addEventListener('change', function () {
        const selectedDate = reserveDateInput.value;
        const selectedRoom = document.getElementById('roomName').value;

        fetchReservations(selectedRoom, selectedDate);
    });

    // Fetch reservations from the backend
    function fetchReservations(room, date) {
        fetch(`/api/reservations?room=${room}&date=${date}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                updateAvailability(data);
            })
            .catch(error => alert(`Error fetching reservations: ${error.message}`));
    }

    // Update the time options based on reservations
    function updateAvailability(reservations) {
        // Clear current time options
        while (timeSelect.firstChild) {
            timeSelect.removeChild(timeSelect.firstChild);
        }

        // Initialize availability flags
        let isFullyBooked = false;
        let halfDayMorningBooked = false;
        let halfDayAfternoonBooked = false;

        // Check reservations
        reservations.forEach(reservation => {
            const reservedTime = reservation.time;

            if (reservedTime === "7:00AM-6:00PM") {
              isFullyBooked = true;
              halfDayMorningBooked = true; // Automatically mark both morning and afternoon as booked
              halfDayAfternoonBooked = true;
            } else if (reservedTime === "7:00AM-12:00PM") {
                halfDayMorningBooked = true; // Morning half booked
            } else if (reservedTime === "1:00PM-6:00PM") {
                halfDayAfternoonBooked = true; // Afternoon half booked
            }
        });

          // Populate available times based on bookings
        const availableTimes = [
            // If morning is not booked and whole day isn't booked, morning slot is available
            { value: "7:00AM-12:00PM", text: "HALFDAY (7:00AM-12:00PM)", remove: halfDayMorningBooked || isFullyBooked },
            // If afternoon is not booked and whole day isn't booked, afternoon slot is available
            { value: "1:00PM-6:00PM", text: "HALFDAY (1:00PM-6:00PM)", remove: halfDayAfternoonBooked || isFullyBooked },
            // If either morning or afternoon is booked, whole day option should be removed
            { value: "7:00AM-6:00PM", text: "WHOLE DAY (7:00AM-6:00PM)", remove: isFullyBooked || halfDayMorningBooked || halfDayAfternoonBooked }
        ];

        let hasAvailableTimes = false;
        
        // Populate time select with available times
        availableTimes.forEach(time => {
            if (!time.remove) {
                const option = document.createElement('option');
                option.value = time.value;
                option.textContent = time.text;
                timeSelect.appendChild(option);
                hasAvailableTimes = true;
            }
        });

        // Handle fully booked condition
        if (!hasAvailableTimes) {
                      // Hide the Reserve Now button
                        if (reserveNowButton) {
                          reserveNowButton.style.display = 'none';
                      }
            if (document.getElementById('time') && timeSelect.parentNode) {
                // Create a new input element
                const inputElement = document.createElement('input');
                inputElement.type = 'text';
                inputElement.id = 'time';
                inputElement.className = 'form-control';
                inputElement.placeholder = 'FULLY BOOKED';
                inputElement.disabled = true;

                // Replace the time select with the new input element
                timeSelect.parentNode.replaceChild(inputElement, timeSelect);
            }
        } else {
          if (reserveNowButton) {
              reserveNowButton.style.display = 'block';
          }
            // If not fully booked, ensure the time select is present
            if (document.getElementById('time') && document.getElementById('time').type === 'text') {
                // Create a new time select element
                const newTimeSelect = document.createElement('select');
                newTimeSelect.id = 'time';
                newTimeSelect.className = 'form-control';
                newTimeSelect.required = true;

                // Re-add original options
                availableTimes.forEach(time => {
                    if (!time.remove) {
                        const option = document.createElement('option');
                        option.value = time.value;
                        option.textContent = time.text;
                        newTimeSelect.appendChild(option);
                    }
                });

                // Replace the input element with the time select
                const inputElement = document.getElementById('time');
                if (inputElement && inputElement.parentNode) {
                    inputElement.parentNode.replaceChild(newTimeSelect, inputElement);
                }
            }
        }
    }
});

function validateGuest() {
  const input = document.getElementById('guest');
  const roomGuestMax = document.getElementById('roomGuest');

  // Get the maximum value from the 'roomGuest' element
  const max = parseInt(roomGuestMax.value);

  // Convert input value to an integer for comparison, defaulting to 0 if not a valid number
  const value = parseInt(input.value);

  // If the input exceeds the maximum, set it to the max
  if (value > max) {
      input.value = max;
  } else if (value < parseInt(input.min)) {
      input.value = input.min;
  }
}

function validateMinDate(input) {
  const today = new Date().toISOString().split('T')[0];
  if (input.value < today) {
      input.value = today;  // Reset the value to today if it's earlier
  }
}
  
  // Handle form submission
  document.querySelector('#bookingForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Show the loader
    document.getElementById('loader').classList.add('show');

    // Gather form data
    const formData = {
      fname: document.getElementById('fname').value,
      lname: document.getElementById('lname').value,
      reserve_date: document.getElementById('reserve_date').value,
      time: document.getElementById('time').value,
      setup: document.getElementById('setup').value,
      businessunit: document.getElementById('businessunit').value,
      branch: document.getElementById('branch').value,
      roomID: document.getElementById('roomID').value,
      roomPrices: document.getElementById('roomPrices').value,
      roomName: document.getElementById('roomName').value,
      guest: document.getElementById('guest').value,
      contact: document.getElementById('contact').value,
      email: document.getElementById('email').value,
      table: document.getElementById('table').value, // Checkbox for table
      chair: document.getElementById('chair').value,
      hdmi: document.getElementById('hdmi').checked,  // Checkbox for HDMI
      extension: document.getElementById('extension').checked, // Checkbox for extension
      message: document.getElementById('message').value
    };
  

    // Send form data to the backend via fetch
    fetch('/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    // .then(response => response.json())
    .then(async (response) => {
      document.getElementById('loader').classList.remove('show'); // Hide the loader

      // Check for 401 Unauthorized error (User not logged in)
      if (response.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Login Required',
          text: 'You must be logged in to make a reservation.',
        });
      }

      return response.json();
    })
    .then(data => {
      if (data.errors) {
        // If there are validation errors, display them
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          html: data.errors.join('<br>'),  // Display each validation error on a new line
        }).then(function() {
          window.location.reload();
      });
      } else if (data.error) {
        // If there is a backend error
        Swal.fire({
          icon: 'error',
          title: 'Booking Failed',
          text: data.error,
        }).then(function() {
          window.location.reload();
      });
      } else {
        // On successful booking
        Swal.fire({
          icon: 'success',
          title: 'Booking Submitted',
          text: `Please wait the email confirmation of your booking.`,
          timer: 1500
        }).then(function() {
          window.location.reload();
      });
      }
    })
    .catch(err => {
      document.getElementById('loader').classList.remove('show');
      // If there's a network error or other fetch issue
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `An unexpected error occurred. Please try again. Error: ${err.message || err}`,
      }).then(function() {
        window.location.reload();
    });
    });
  });

  const selectElement = document.getElementById('setup');
  const previewLink = document.getElementById('previewLink');
  const roomInput = document.getElementById('roomID');  // Hidden input for room
  
  // Function to update the preview link and hidden input
  function updatePreviewLink() {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const RoomselectedValue = roomInput.value;
    const selectedImage = selectedOption.getAttribute('data-img');
    
    // Special case for IT-Room
    if (RoomselectedValue === "IT-Room") {
      previewLink.style.display = 'none';  // Hide the preview link for IT-Room
    } else if (selectedOption.value === "CUSTOM-SETUP") {
      previewLink.style.display = 'none';  // Hide the preview link for Custom Setup
    } else if (RoomselectedValue !== "IT-Room" && selectedImage) {
      previewLink.href = selectedImage;  // Set the href of the link
      previewLink.style.display = 'inline';  // Show the preview link if image exists
      previewLink.style.pointerEvents = 'auto';  // Enable the link
    } else {
      previewLink.href = '#';  // Reset href if no image is available
      previewLink.style.pointerEvents = 'none';  // Disable the link
      previewLink.style.display = 'inline';  // Show the preview link (for other cases)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No image available for this option.',
      });
    }
  }
  
  // Trigger the change event on page load to set the default preview
  window.onload = function() {
    updatePreviewLink(); // Set preview for the default selected option
  };
  
  // Update the preview link and hidden input when the user changes the selection
  selectElement.addEventListener('change', updatePreviewLink);
  
  // Optionally set the initial state to disabled
  previewLink.style.pointerEvents = 'none';
  