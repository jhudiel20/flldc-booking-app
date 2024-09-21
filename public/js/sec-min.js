


  // Handle form submission
  document.querySelector('#bookingForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Gather form data
    const formData = new FormData(this);

    // Send form data to the backend via fetch
    fetch('/api/rooms', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.errors) {
        // If there are validation errors, display them
        Swal.fire({
          icon: 'error',
          title: 'Validation Error',
          html: data.errors.join('<br>'),  // Display each validation error on a new line
        });
      } else if (data.error) {
        // If there is a backend error
        Swal.fire({
          icon: 'error',
          title: 'Booking Failed',
          text: data.error,
        });
      } else {
        // On successful booking
        Swal.fire({
          icon: 'success',
          title: 'Booking Successful',
          text: `Your reservation ID is ${data.reservationId}`,
        });
      }
    })
    .catch(err => {
      // If there's a network error or other fetch issue
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
      });
    });
  });


// Get the current URL path (without domain and query parameters)
 const currentPath = window.location.pathname.split('/').pop() || 'index';

//  console.log(currentPath);

 // Get all nav-link elements
 const navLinks = document.querySelectorAll('.nav-link');

 // Iterate through each nav-link and compare its href with the current path
 navLinks.forEach(link => {
   // Extract the relative path from the href attribute
   const linkPath = link.getAttribute('href');

   // If the href matches the current path, add the 'active' class
   if (linkPath === currentPath) {
     link.classList.add('active');
   }
 });


// Function to load HTML files from the 'includes' folder into a specified element
function includeHTML(file, elementID) {
    fetch(`includes/${file}.html`)
      .then(response => response.text())
      .then(data => {
        document.getElementById(elementID).innerHTML = data;
      })
      .catch(error => console.error('Error loading HTML:', error));
  }

  // Load navigation and footer
//   includeHTML('nav', 'navigation');
  includeHTML('footer', 'footer');