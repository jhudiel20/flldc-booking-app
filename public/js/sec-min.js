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


  includeHTML('header', 'header').then(() => {
    const loginModal = document.getElementById('LoginModal');
    if (loginModal) {
        loginModal.addEventListener('click', function () {
            Swal.fire({
                title: 'Sign In',
                html: `
                    <div>
                        <label for="username" class="form-label">Username</label>
                        <input type="text" id="username" class="form-control mb-3" placeholder="Enter your username">
                    </div>
                    <div>
                        <label for="password" class="form-label">Password</label>
                        <input type="password" id="password" class="form-control" placeholder="Enter your password">
                    </div>
                    <div class="mt-3">
                        <button id="registerLink" class="btn btn-link p-0">Don't have an account? Register here</button>
                    </div>
                `,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Login',
                cancelButtonText: 'Cancel',
                customClass: {
                    confirmButton: 'btn btn-primary me-3',
                    cancelButton: 'btn btn-secondary',
                    buttons: 'custom-buttons'
                },
                buttonsStyling: false
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value;

                    if (username && password) {
                        try {
                            const success = await loginUser(username, password);
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

            // Handle Registration Link Click
            document.getElementById('registerLink').addEventListener('click', function () {
                Swal.fire({
                    title: 'Register',
                    html: `
                        <div>
                            <label for="newUsername" class="form-label">Username</label>
                            <input type="text" id="newUsername" class="form-control mb-3" placeholder="Enter a username">
                        </div>
                        <div>
                            <label for="newPassword" class="form-label">Password</label>
                            <input type="password" id="newPassword" class="form-control" placeholder="Enter a password">
                        </div>
                        <div>
                            <label for="confirmPassword" class="form-label">Confirm Password</label>
                            <input type="password" id="confirmPassword" class="form-control" placeholder="Confirm your password">
                        </div>
                        <div class="mt-3">
                    `,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Register',
                    cancelButtonText: 'Cancel',
                    customClass: {
                        confirmButton: 'btn btn-primary me-3',
                        cancelButton: 'btn btn-secondary',
                        buttons: 'custom-buttons'
                    },
                    buttonsStyling: false
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const newUsername = document.getElementById('newUsername').value;
                        const newPassword = document.getElementById('newPassword').value;
                        const confirmPassword = document.getElementById('confirmPassword').value;

                        if (newUsername && newPassword && confirmPassword) {
                            if (newPassword === confirmPassword) {
                                try {
                                    const success = await registerUser(newUsername, newPassword);
                                    if (success) {
                                        Swal.fire('Success!', 'Your account has been created. You can now log in.', 'success');
                                    } else {
                                        Swal.fire('Failed!', 'An error occurred during registration. Please try again later.', 'error');
                                    }
                                } catch (error) {
                                    Swal.fire('Error!', 'An error occurred during registration. Please try again later.', 'error');
                                }
                            } else {
                                Swal.fire('Error!', 'Passwords do not match.', 'error');
                            }
                        } else {
                            Swal.fire('Error!', 'Please fill in all fields.', 'error');
                        }
                    }
                });
            });
        });
    } else {
        console.error("Element with ID 'LoginModal' not found.");
    }
});


// async function registerUser(username, password) {
//   try {
//       const response = await fetch('/register', { // Adjust the endpoint to your actual registration route
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ username, password }),
//       });

//       const data = await response.json();
//       if (data.success) {
//           return true;
//       } else {
//           return false;
//       }
//   } catch (error) {
//       console.error('Registration failed', error);
//       return false;
//   }
// }



  


