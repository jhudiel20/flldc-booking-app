document.addEventListener('DOMContentLoaded', function () {
    const bookingForm = document.getElementById('bookingForm');
    const reserveDateInput = document.getElementById('reserve_date');
    const timeSelect = document.getElementById('time');
    const reserveNowButton = document.getElementById('submit');
    const originalTimeHTML = timeSelect.outerHTML; // Store the original HTML of the time select

    // Event listener for date change
    reserveDateInput.addEventListener('change', function () {
        const selectedDate = reserveDateInput.value;
        const selectedRoom = document.getElementById('room').value;

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