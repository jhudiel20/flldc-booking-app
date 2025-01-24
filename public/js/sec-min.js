
document.addEventListener('DOMContentLoaded', function () {
  const loginModal = document.getElementById('LoginModal');
  if (loginModal) {
      loginModal.addEventListener('click', function () {
          Swal.fire({
              title: 'Login',
              html: `
                  <div>
                      <label for="username" class="form-label">Username</label>
                      <input type="text" id="username" class="form-control mb-3" placeholder="Enter your username">
                  </div>
                  <div>
                      <label for="password" class="form-label">Password</label>
                      <input type="password" id="password" class="form-control" placeholder="Enter your password">
                  </div>
              `,
              icon: 'info',
              showCancelButton: true,
              confirmButtonText: 'Login',
              cancelButtonText: 'Cancel',
              customClass: {
                  confirmButton: 'btn btn-primary me-3',
                  cancelButton: 'btn btn-secondary'
              },
              buttonsStyling: false
          }).then(async (result) => {
              if (result.isConfirmed) {
                  const username = document.getElementById('username').value;
                  const password = document.getElementById('password').value;

                  if (username && password) {
                      try {
                          const success = await loginUser(username, password); // Replace with your logic
                          if (success) {
                              Swal.fire('Success!', 'You are now logged in.', 'success');
                          } else {
                              Swal.fire('Failed!', 'Invalid username or password.', 'error');
                          }
                      } catch (error) {
                          Swal.fire('Error!', 'An error occurred during login. Please try again later.', 'error');
                      }
                  } else {
                      Swal.fire('Error!', 'Please fill in all fields.', 'error');
                  }
              }
          });
      });
  } else {
      console.error("Element with ID 'login-modal' not found.");
  }
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
  return fetch(`includes/${file}.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      document.getElementById(elementID).innerHTML = data;
    })
    .catch(error => console.error('Error loading HTML:', error));
}

// Load navigation and footer
Promise.all([
  includeHTML('header', 'header'),
  includeHTML('footer', 'footer')
]).then(() => {
  // Call loadRooms only after the header has been loaded
  loadRooms();
  if (typeof loadAllRooms === 'function') {
    loadAllRooms();
  }
});
  
  async function loadRooms() {
    const dropdown = document.querySelector('#roomDropdown');
   
    // Fetch rooms from the API
    const response = await fetch('/api/available_rooms.js');
  
    // If the response is not OK, log an error and return
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return; // Exit if the response is not OK
    }

    const rooms = await response.json();

    // Check if there are any rooms
    if (rooms.length === 0) {
      dropdown.innerHTML = '<a class="dropdown-item" href="#">No rooms available</a>'; // Message if no rooms
      return;
    }

    dropdown.innerHTML = ''; 

    // Add the "Check Reservation" link and a horizontal rule
    const checkReservationLink = document.createElement('a');
    checkReservationLink.classList.add('dropdown-item');
    checkReservationLink.href = 'check';
    checkReservationLink.textContent = 'Check Reservation';
    dropdown.appendChild(checkReservationLink);

    // Add the horizontal rule
    dropdown.appendChild(document.createElement('hr'));

    const allRoomsLink = document.createElement('a');
      allRoomsLink.classList.add('dropdown-item');
      allRoomsLink.href = 'allrooms';
      allRoomsLink.textContent = 'All Rooms';
      dropdown.appendChild(allRoomsLink);
  
      rooms.forEach(room => {
        const roomLink = document.createElement('a');
        roomLink.classList.add('disabled'); 
        roomLink.className = 'dropdown-item';
        const encodedRoomId = encodeURIComponent(room.room_id);
        roomLink.href = `rooms?ID=${encodedRoomId}`;
        roomLink.textContent = room.room_name;
        dropdown.appendChild(roomLink);
      });
    
      dropdown.dataset.loaded = 'true';
  }
  


