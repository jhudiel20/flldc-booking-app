fetch('/api/validate-cookie') // API endpoint to validate the cookie
    .then(function(response) {
        if (response.ok) {
            return response.json();  // Parse the response as JSON
        } else {
            console.error('User is not logged in.');
        }
    })
    .then(function(userData) {
        if (userData) {

            // DOM manipulation: Populating the input fields with user data
            document.getElementById('user_id').value = userData.userId;
            document.getElementById('email').value = userData.email;
            document.getElementById('fname').value = userData.firstName;
            document.getElementById('lname').value = userData.lastName;
            // document.getElementById('branch').textContent = userData.branch;
            let businessUnitSelect = document.getElementById('businessunit');
            let sbuValue = userData.sbu;

            for (let i = 0; i < businessUnitSelect.options.length; i++) {
                if (businessUnitSelect.options[i].value === sbuValue) {
                    businessUnitSelect.selectedIndex = i;
                    break;
                }
            }

            // Set branch
            let branchSelect = document.getElementById('branch');
            let branchValue = userData.branch;
            for (let i = 0; i < branchSelect.options.length; i++) {
                if (branchSelect.options[i].value === branchValue) {
                    branchSelect.selectedIndex = i;
                    break;
                }
            }
        }
    })
    .catch(function(error) {
        console.error('Error fetching user data:', error);
    });


async function checkUserStatus() {
  try {
      const response = await fetch('/api/validate-cookie'); // API endpoint to validate the cookie
      if (response.ok) {
          const userData = await response.json();
          console.log('User Data:', userData);

          // Hide the "Login" link
          const loginItem = document.getElementById('loginItem');
          if (loginItem) {
              loginItem.style.display = 'none';
          }

          const BookNow = document.getElementById('BookNow');
          if (BookNow) {
              BookNow.style.display = 'block';
          }

          const LogoutDropdown = document.getElementById('LogoutDropdown');
          if (LogoutDropdown) {
              LogoutDropdown.style.display = 'block';
          }
      } else {
          console.error('User is not logged in.');
      }
  } catch (error) {
      console.error('Error checking user status:', error);
  }

  // Add event listener to logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
      logoutBtn.addEventListener('click', function(event) {
          event.preventDefault(); // Prevent the default link action

          // Show SweetAlert confirmation dialog
          Swal.fire({
              title: 'Are you sure?',
              text: 'You will be logged out!',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, log me out',
              cancelButtonText: 'No, stay logged in',
              reverseButtons: true
          }).then(async (result) => {
              if (result.isConfirmed) {
                  try {
                      // Send a POST request to the /logout route to delete the cookie
                      const logoutResponse = await fetch('/api/logout', {
                          method: 'POST', // POST method for logout
                          credentials: 'same-origin', // Include cookies with the request
                      });

                      if (logoutResponse.ok) {
                          // Reload the current page after logout
                          window.location.reload(); // This reloads the current page
                      } else {
                          console.error('Logout failed');
                      }
                  } catch (error) {
                      console.error('Error logging out:', error);
                  }
              }
          });
      });
  } else {
      console.log('Logout button not found');
  }
}

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
        fetch(`/api/reservation?room=${room}&date=${date}`)
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
// document.querySelector('#bookingForm').addEventListener('submit', function (e) {
//   e.preventDefault(); // Prevent default form submission
//   checkUserStatus();

//   // Show the loader
//   document.getElementById('loader').classList.add('show');

//   // Gather form data
//   const formData = {
//     user_id: document.getElementById('user_id').value,
//     fname: document.getElementById('fname').value,
//     lname: document.getElementById('lname').value,
//     reserve_date: document.getElementById('reserve_date').value,
//     time: document.getElementById('time').value,
//     setup: document.getElementById('setup').value,
//     businessunit: document.getElementById('businessunit').value,
//     branch: document.getElementById('branch').value,
//     roomID: document.getElementById('roomID').value,
//     roomPrices: document.getElementById('roomPrices').value,
//     roomName: document.getElementById('roomName').value,
//     guest: document.getElementById('guest').value,
//     contact: document.getElementById('contact').value,
//     email: document.getElementById('email').value,
//     table: document.getElementById('table').value, // Checkbox for table
//     chair: document.getElementById('chair').value,
//     hdmi: document.getElementById('hdmi').checked,  // Checkbox for HDMI
//     extension: document.getElementById('extension').checked, // Checkbox for extension
//     message: document.getElementById('message').value
//   };

//   // Send form data to the backend via fetch
//   fetch('/api/rooms', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(formData)
//   })
//   .then(response => response.json())
//   .then(data => {
//     document.getElementById('loader').classList.remove('show'); // Hide loader

//     // Check if there's any error in the response
//     if (data.error || data.errors) {
//       // Display error notification
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: data.errors,
//       }).then(() => {
//         window.location.reload(); // Optionally reload the page
//       });
//     } else {
//       // On successful booking
//       Swal.fire({
//         icon: 'success',
//         title: 'Booking Submitted',
//         text: 'Please wait for the email confirmation of your booking.',
//         timer: 1500,
//       }).then(() => {
//         window.location.reload(); // Optionally reload the page
//       });
//     }
//   })
//   .catch(err => {
//     document.getElementById('loader').classList.remove('show'); // Hide loader

//     // If there's a network error or other fetch issue
//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: `An unexpected error occurred. Please try again. Error: ${err.message || err}`,
//     }).then(() => {
//       window.location.reload(); // Optionally reload the page
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector('#bookingForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Show Terms and Agreement Modal
    Swal.fire({
      title: 'Terms and Agreement',
      width: '700px',
      html: `
        <div id="termsContent" style="height: 500px; overflow-y: auto; text-align: left; padding: 10px; border: 1px solid #ccc;">
         <p><strong>By reserving the Learning and Development Center (L&D Center), you agree to the following terms and conditions:</strong></p>
          <p><strong>1. Reservation Confirmation</strong></p>
          <ul>
              <li>All reservations are subject to approval and availability.</li>
              <li>A reservation is confirmed only upon receipt of full payment or a valid payment method.</li>
              <li>If an internal business unit is responsible for payment, confirmation will be provided via email, and costs will be charged accordingly.</li>
          </ul>

          <p><strong>2. Cancellation and No-Show Policy</strong></p>
          <ul>
              <li>Cancellations made within 120 hours (5 days) of the scheduled booking are non-refundable, and the full booking cost will be charged.</li>
              <li>Failure to arrive at the scheduled time without prior cancellation (no-show) will result in the full cost being charged to the responsible party.</li>
          </ul>

          <p><strong>3. Reservation Modifications</strong></p>
          <ul>
              <li>Any changes to the reservation (date, time, or room adjustments) must be requested at least 120 hours before the scheduled booking.</li>
              <li>Modifications within this period will not be accepted unless exceptional circumstances arise, subject to L&D Center management approval.</li>
          </ul>

          <p><strong>4. Payment Terms</strong></p>
          <ul>
              <li>Full payment is required upon reservation approval.</li>
              <li>Where applicable, costs will be directly charged to the responsible department or business unit/company.</li>
          </ul>

          <p><strong>5. Usage Guidelines</strong></p>
          <ul>
              <li>The L&D Center must be used for its intended purpose, such as training, meetings, workshops, and corporate events.</li>
              <li>The use of the facility for personal events, non-work-related gatherings, or external commercial purposes is subject to prior approval.</li>
          </ul>

          <p><strong>6. Facility Access and Security</strong></p>
          <ul>
              <li>Access to the L&D Center is granted only for the approved booking duration. Additional time beyond the reservation period requires prior approval and may incur additional charges.</li>
              <li>Security protocols must be followed at all times, and all visitors must register at the reception upon arrival.</li>
          </ul>

          <p><strong>7. Property Damage and Liability</strong></p>
          <ul>
              <li>Any damage to property, furniture, or fixtures during the reservation period will be charged to the responsible individual or organization.</li>
              <li>The reserving party is fully liable for any damages or losses incurred.</li>
          </ul>

          <p><strong>8. Personal Belongings</strong></p>
          <ul>
              <li>The L&D Center is not responsible for lost, stolen, or misplaced personal items. Attendees must secure their belongings.</li>
          </ul>

          <p><strong>9. Cleanliness and Maintenance</strong></p>
          <ul>
              <li>The L&D Center must be kept clean and orderly throughout and after the event.</li>
              <li>Any additional cleaning required due to improper use of the facility may result in extra charges.</li>
          </ul>

          <p><strong>10. Catering and Food Policy</strong></p>
          <ul>
              <li>Food and beverages are not included in the reservation fee.</li>
              <li>A canteen is available on the first floor where meals and snacks can be purchased.</li>
              <li>Outside catering may be allowed but requires prior approval.</li>
          </ul>

          <p><strong>11. Wi-Fi and Technical Support</strong></p>
          <ul>
              <li>Complimentary Wi-Fi is available, with one access voucher per person. Vouchers can be collected from the security desk.</li>
              <li>Technical support (e.g., for projectors, sound systems, or video conferencing) must be requested in advance and may be subject to additional fees.</li>
          </ul>

          <p><strong>12. Compliance with Policies and Regulations</strong></p>
          <ul>
              <li>All users must comply with company policies, safety regulations, and emergency procedures while using the L&D Center.</li>
              <li>Any violations of these policies may result in additional penalties, cancellation of future bookings, or disciplinary action where applicable.</li>
          </ul>

          <p><strong>13. Liability Disclaimer</strong></p>
          <ul>
              <li>The L&D Center is not liable for any personal injuries, losses, or damages incurred during the reservation period.</li>
              <li>The reserving party assumes full responsibility for ensuring the safety and well-being of attendees.</li>
          </ul>

          <p><strong>By proceeding with your reservation, you acknowledge and agree to these terms and conditions.</strong></p>
        </div>
        <div id="proceedContainer" style="display: none; text-align: center; margin-top: 10px;">
          <button id="proceedBtn" class="btn btn-primary" style="cursor: pointer;">Proceed</button>
          <button id="cancelBtn" class="btn btn-secondary" style="cursor: pointer;">Cancel</button>
        </div>
      `,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: () => {
        let termsContent = document.getElementById("termsContent");
        let proceedContainer = document.getElementById("proceedContainer");
        let proceedBtn = document.getElementById("proceedBtn");
        let cancelBtn = document.getElementById("cancelBtn");

        termsContent.addEventListener("scroll", function () {
          if (termsContent.scrollTop + termsContent.clientHeight >= termsContent.scrollHeight - 10) {
            proceedContainer.style.display = "block"; // Show the button
            proceedContainer.style.opacity = 0;
            setTimeout(() => proceedContainer.style.opacity = 1, 300);
          }
        });

        proceedBtn.addEventListener("click", () => {
          Swal.close(); // Close modal
          submitBookingForm(); // Proceed with booking form submission
        });

        // Cancel button functionality
        cancelBtn.addEventListener("click", () => {
          Swal.close(); // Close modal
        });
      }
    });
  });

  function submitBookingForm() {
    // Show the loader
    document.getElementById('loader').classList.add('show');

    // Gather form data
    const formData = {
      user_id: document.getElementById('user_id').value,
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
      table: document.getElementById('table').checked, // Checkbox
      chair: document.getElementById('chair').checked, // Checkbox
      hdmi: document.getElementById('hdmi').checked,  // Checkbox
      extension: document.getElementById('extension').checked, // Checkbox
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
    .then(response => response.json())
    .then(data => {
      document.getElementById('loader').classList.remove('show'); // Hide loader

      if (data.error || data.errors) {
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.errors,
        }).then(() => {
          window.location.reload(); // Optionally reload the page
        });
      } else {
        // Success message
        Swal.fire({
          icon: 'success',
          title: 'Booking Submitted',
          text: 'Please wait for the email confirmation of your booking.',
          timer: 1500,
        }).then(() => {
          window.location.reload(); // Optionally reload the page
        });
      }
    })
    .catch(err => {
      document.getElementById('loader').classList.remove('show'); // Hide loader

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `An unexpected error occurred. Please try again. Error: ${err.message || err}`,
      }).then(() => {
        window.location.reload(); // Optionally reload the page
      });
    });
  }
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
  