
// Get the current URL path (without domain and query parameters)
 const currentPath = window.location.pathname.split('/').pop() || 'index';

//  console.log(currentPath);

 // Get all nav-link elments
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




  document.querySelector('#ratingForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission
  
    // Show the loader
    document.getElementById('loader').classList.add('show');
  
    // Gather form data
    const formData = {
      rating: document.getElementById('rating').value
      };
  
  
    // Send form data to the backend via fetch
    fetch('/api/ratings', {
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
          title: 'Rating Failed',
          text: data.error,
        }).then(function() {
          window.location.reload();
      });
      } else {
        // On successful booking
        Swal.fire({
          icon: 'success',
          title: 'Rating Submitted',
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