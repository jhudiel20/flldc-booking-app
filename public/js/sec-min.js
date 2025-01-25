import { branches } from '/js/modules.js';


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
                        <label for="email" class="form-label">Email</label>
                        <input type="text" id="email" class="form-control mb-3" placeholder="Enter your Email">
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
                    const email = document.getElementById('email').value.trim();
                    const password = document.getElementById('password').value.trim();

                    if (!email || !password) {
                        Swal.fire('Error!', 'Please fill in all fields.', 'error');
                        return;
                    }

                    try {
                      const loginData = {
                        email,
                        password                      
                      };

                      const response = await fetch('/api/UserLogin', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(loginData)
                      });

                      const result = await response.json();

                      if (result.error) {
                          Swal.fire('Error!', result.error, 'error');
                          return;
                      } else {
                          Swal.fire('Success!', 'Successfully Login.', 'success');
                      }
                    } catch (error) {
                        Swal.fire('Error!', 'Login failed. Please try again.', 'error');
                        return;
                    }
                }
            });

            // Handle Registration Link Click
            document.getElementById('registerLink').addEventListener('click', function () {
                Swal.fire({
                    title: 'Sign Up',
                    html: `
                        <div>
                            <label for="fname" class="form-label">First Name</label>
                            <input type="text" id="fname" class="form-control mb-3" required>
                        </div>
                        <div>
                            <label for="lname" class="form-label">Last Name</label>
                            <input type="text" id="lname" class="form-control mb-3" required>
                        </div>
                        <div>
                            <label for="email" class="form-label">Email</label>
                            <input type="email" id="email" class="form-control mb-3" required>
                        </div>
                        <div>
                            <label for="newPassword" class="form-label">Password</label>
                            <input type="password" id="newPassword" class="form-control mb-3" required>
                        </div>
                        <div>
                            <label for="confirmPassword" class="form-label">Confirm Password</label>
                            <input type="password" id="confirmPassword" class="form-control mb-3" required>
                        </div>
                        <div>
                            <label for="usertype" class="form-label">User Type</label>
                            <select id="usertype" class="form-control mb-3">
                                <option value="Non-FAST Employee">Non-FAST Employee</option>
                                <option value="FAST Employee">FAST Employee</option>
                            </select>
                        </div>
                        <div id="SBUContainer" style="display: none;">
                            <div>
                                <label for="SBU" class="form-label">SBU</label>
                                <select id="SBU" class="form-control mb-3">
                                    <option value="FSC">FSC</option>
                                    <option value="FLC">FLC</option>
                                    <option value="FTMC">FTMC</option>
                                    <option value="FCSI">FCSI</option>
                                    <option value="FDC">FDC</option>
                                    <option value="FUI">FUI</option>
                                </select>
                            </div>
                            <div>
                                <label for="branch" class="form-label">Branch</label>
                                <select id="branchSelect" class="form-control mb-3">
                                </select>
                            </div>
                        </div>
                    `,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Register',
                    cancelButtonText: 'Cancel',
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        cancelButton: 'btn btn-secondary',
                        buttons: 'custom-buttons'
                    },
                    buttonsStyling: false
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const fname = document.getElementById('fname').value.trim();
                        const lname = document.getElementById('lname').value.trim();
                        const email = document.getElementById('email').value.trim();
                        const password = document.getElementById('newPassword').value.trim();
                        const confirmPassword = document.getElementById('confirmPassword').value.trim();
                        const userType = document.getElementById('usertype').value;
                        const sbu = document.getElementById('SBU') ? document.getElementById('SBU').value : null;
                        const branch = document.getElementById('branchSelect') ? document.getElementById('branchSelect').value : null;

                        // Enhanced validation
                        if (!fname || !lname || !email || !password || !confirmPassword) {
                            Swal.fire('Error!', 'All fields are required.', 'error');
                            return;
                        }

                        if (password !== confirmPassword) {
                            Swal.fire('Error!', 'Passwords do not match.', 'error');
                            return;
                        }

                        // Check for valid email format
                        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                        if (!emailRegex.test(email)) {
                            Swal.fire('Error!', 'Please enter a valid email address.', 'error');
                            return;
                        }

                        try {
                            const registrationData = {
                                fname,
                                lname,
                                email,
                                password,
                                confirmPassword,
                                userType,
                                sbu,
                                branch
                            };

                            const response = await fetch('/api/UserRegistration', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(registrationData)
                            });

                            const result = await response.json();

                            if (result.error) {
                                Swal.fire('Error!', result.error, 'error');
                                return;
                            } else {
                                Swal.fire('Success!', 'Registration completed.', 'success');
                            }
                        } catch (error) {
                            Swal.fire('Error!', 'Registration failed. Please try again.', 'error');
                            return;
                        }
                    }
                });
                        // Populate Branch Options
              const branchSelect = document.getElementById('branchSelect');
              branchSelect.innerHTML = ''; // Clear previous options
              branches.forEach((branch) => {
                  const option = document.createElement('option');
                  option.value = branch;
                  option.textContent = branch;
                  branchSelect.appendChild(option);
              });

              // Show/Hide SBU Based on User Type
              const userTypeSelect = document.getElementById('usertype');
              const sbuContainer = document.getElementById('SBUContainer');
              userTypeSelect.addEventListener('change', function () {
                  sbuContainer.style.display = userTypeSelect.value === 'FAST Employee' ? 'block' : 'none';
              });
            });
        });
    } else {
        console.error("Element with ID 'LoginModal' not found.");
    }
});


  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // Check for the 'user_data' cookie (or your actual cookie name)
  const userData = getCookie('user_data');

  if (userData) {
    // Hide the "Login" link
    const loginItem = document.getElementById('loginItem');
    if (loginItem) {
      loginItem.style.display = 'none';
    }

    // Add a user icon with a green dot
    const navBar = document.querySelector('.navbar-nav'); // Adjust selector to your nav container
    if (navBar) {
      const userItem = document.createElement('li');
      userItem.className = 'nav-item cta';
      userItem.innerHTML = `
        <a class="nav-link" href="profile">
          <span style="display: flex; align-items: center;">
            <i class="fas fa-user-circle" style="font-size: 20px;"></i>
            <span style="width: 8px; height: 8px; background-color: green; border-radius: 50%; margin-left: 5px;"></span>
          </span>
        </a>
      `;
      navBar.appendChild(userItem);
    }
  }







  


