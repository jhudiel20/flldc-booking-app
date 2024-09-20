
document.getElementById('bookingForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Collect form data
  const formData = {
    reserve_date: document.getElementById('reserve_date').value,
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

  try {
    // Send form data to the API route
    const response = await fetch('/api/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message); // Display success message
    } else {
      alert(result.error); // Display error message
    }
  } catch (error) {
    console.error('Error:', error);
  }
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