document.addEventListener('DOMContentLoaded', () => {
  const roomDropdown = document.getElementById('roomDropdown');

  // Fetch room data from the backend
  fetch('/api/rooms')
    .then((response) => response.json())
    .then((rooms) => {
      rooms.forEach((room) => {
        const roomLink = document.createElement('a');
        roomLink.classList.add('dropdown-item');
        roomLink.href = `rooms${room.id}`;  // Example: rooms301
        roomLink.textContent = room.name;  // Assuming 'name' is a column in 'room_details'

        roomDropdown.appendChild(roomLink);
      });
    })
    .catch((error) => {
      console.error('Error fetching room data:', error);
    });
});




if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 1500, // Animation duration
    once: false,    // Allows animations to happen every time you scroll past
    mirror: true    // Repeat animations on scroll-up
  });
}

function toggleExtras() {
  const extrasDiv = document.getElementById('extras');
  extrasDiv.classList.toggle('d-none');  // Toggle the d-none class
}

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
  includeHTML('header', 'header');
  includeHTML('footer', 'footer');




