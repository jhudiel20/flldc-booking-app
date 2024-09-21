  // Handle form submission
  document.querySelector('#bookingForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Gather form data
    const formData = {
      reserve_date: document.getElementById('reserve_date').value,
      time: document.getElementById('time').value,
      businessunit: document.getElementById('businessunit').value,
      room: document.getElementById('room').value,
      guest: document.getElementById('guest').value,
      contact: document.getElementById('contact').value,
      email: document.getElementById('email').value,
      table: document.getElementById('table').checked, // Checkbox for table
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
    .then(response => response.json())
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
        }).then(function() {
          window.location.reload();
      });
      }
    })
    .catch(err => {
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