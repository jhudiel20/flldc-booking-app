const branches = [
  "ALABANG", "ALABANG-FMM", "ALABANG-RETAIL", "AZUCENA-PMFTC OVERFLOW", 
  "BACOLOD", "BACOLOD-NA", "BACOLOD-PERSONAL COLLECTION", "BACOLOD-SHELL", 
  "BALITE-PMFTC OVERFLOW", "BASILAN", "BATANGAS", "BATANGAS-CDI", 
  "BATANGAS-CDO FOODSPHERE RETAIL", "BATANGAS-HONDA", "BATANGAS-NPI", 
  "BATANGAS-NPI RETAIL", "BATANGAS-PMFTC", "BATANGAS-PMFTC OVERFLOW", 
  "BATANGAS-SAFI", "BATANGAS-YAMAHA", "BATINO-NPI EXTENSION", 
  "BATINO-NPI ICD", "BATINO-NPI RETAIL", "BATINO-NPI SDC", "BATINO-SDC TRUCKING", 
  "BATINO-TRUCKING", "BAYBAY", "BORONGAN", "BULACAN-NDC TRUCKING", 
  "BULACAN-NPI NDC", "BULACAN-NPI NDC CAW", "BUTUAN", "CABUYAO", 
  "CABUYAO-ABBOTT", "CABUYAO-ABBOTT-RETAIL", "CABUYAO-ACTIMED INC.", 
  "CABUYAO-DMPI", "CABUYAO-EC OVERFLOW", "CABUYAO-FAPC", "CABUYAO-GREEN CROSS INC.", 
  "CABUYAO-J&J", "CABUYAO-J&J RETAIL", "CABUYAO-J&J TRANSPORT", "CABUYAO-L&D CENTER", 
  "CABUYAO-LAGUNA", "CABUYAO-MEGA PACK", "CABUYAO-NA RETAIL", "CABUYAO-NPI", 
  "CABUYAO-NPI DC", "CABUYAO-NPI LISP FG", "CABUYAO-NPI MMC3", "CABUYAO-NPI OVERFLOW", 
  "CABUYAO-NPI RETAIL", "CABUYAO-NPI TRUCKING", "CABUYAO-NUTRIASIA", 
  "CABUYAO-P&G", "CABUYAO-P&G RETAIL", "CABUYAO-PERSONAL COLLECTION", 
  "CABUYAO-PMFTC OVERFLOW", "CABUYAO-PMFTC1", "CABUYAO-PMFTC2", "CABUYAO-RENGO", 
  "CABUYAO-RFM", "CABUYAO-UNILEVER", "CABUYAO-URC", "CABUYAO-VMI RETAIL", 
  "CAGAYAN", "CAGAYAN - NPI CDC RETAIL", "CAGAYAN-DMPI", "CAGAYAN-DMPI RETAIL", 
  "CAGAYAN-FACILITY", "CAGAYAN-FMM", "CAGAYAN-GMC", "CAGAYAN-NPI", 
  "CAGAYAN-NPI PHARMA", "CAGAYAN-NPI RETAIL", "CAGAYAN-PERSONAL COLLECTION", 
  "CAGAYAN-PMFTC", "CAGAYAN-ROBINSONS", "CAGAYAN-SHELL", "CAGAYAN-SILVERSWAN", 
  "CAGAYAN-URC", "CAINTA-MONDELEZ", "CALAMBA OVERFLOW", "CALAMBA-ALFAMART", 
  "CALAMBA-DISTRIPHIL", "CALAMBA-GREEN CROSS INC.", "CALAMBA-JAPAN TOBACCO INT'L.", 
  "CALAMBA-JAPAN TOBACCO INT'L. OVERFLOW", "CALAMBA-JOLLIBEE", "CALAMBA-LAGUNA", 
  "CALAMBA-MMC SDC", "CALAMBA-P&G", "CALAMBA-RED RIBBON SITE", "CALAMBA-RFM", 
  "CALAMBA-RFM RETAIL", "CALAMBA-WYETH", "CALBAYOG", "CALBAYOG-NA", 
  "CALBAYOG-NPI", "CAMIGUIN", "CANLUBANG-EDWARD KELLER", "CANLUBANG-ZUELLIG", 
  "CARMONA-KALINISAN CHEMICALS CORP.", "CARMONA-LAFARGE", "CARMONA-LAFARGE RETAIL", 
  "CARMONA-OVERFLOW 1", "CARMONA-OVERFLOW 2", "CATARMAN", "CATBALOGAN-NPI", 
  "CAUAYAN-ZUELLIG", "CEBU", "CEBU-CDI", "CEBU-COLPAL", "CEBU-EPI", "CEBU-FACILITY", 
  "CEBU-FACILITY 2", "CEBU-FDI", "CEBU-FMM", "CEBU-GMC", "CEBU-GREEN CROSS", 
  "CEBU-JJPI RDC", "CEBU-JOLLIBEE CONSO", "CEBU-JOLLIBEE CONSO-2", "CEBU-KIMBERLY CLARK", 
  "CEBU-KIMBERLY CLARK RETAIL", "CEBU-MARIWASA", "CEBU-MONDE NISSIN", "CEBU-NA", 
  "CEBU-NATIONAL BOOKSTORE", "CEBU-NEXTRADE", "CEBU-NEXTRADE RETAIL", "CEBU-NPI ICD", 
  "CEBU-NPI PHARMA", "CEBU-NPI RETAIL", "CEBU-NPI VDC", "CEBU-NPI VDC OVERFLOW", 
  "CEBU-NPI VDC RETAIL", "CEBU-PERSONAL COLLECTION", "CEBU-PILMICO CONSO", 
  "CEBU-PRIFOOD", "CEBU-RFM", "CEBU-SHELL", "CEBU-SYSU", "CEBU-TRANSPORT", 
  "CEBU-URC", "CEBU-URC CONSO", "CEBU-URC SAN FERNANDO", "CEBU-WYETH", "CORPORATE", 
  "COTABATO", "COTABATO-DOLE RETAIL", "DAGUPAN", "DASMARIÑAS-GREEN CROSS INC", 
  "DASMARIÑAS-GREEN CROSS INC.-2", "DASMARIÑAS-OVERFLOW", "DASMARIÑAS-PMFTC OVERFLOW", 
  "DAVAO", "DAVAO-CDI", "DAVAO-CITIHARDWARE", "DAVAO-EPI", "DAVAO-FMM", 
  "DAVAO-JS UNITRADE", "DAVAO-JS UNITRADE RETAIL", "DAVAO-NA", "DAVAO-NEXTRADE", 
  "DAVAO-NPI PHARMA", "DAVAO-PERSONAL COLLECTION", "DAVAO-PERSONAL COLLECTION-2", 
  "DAVAO-PMFTC", "DAVAO-PRIFOOD", "DAVAO-RFM", "DAVAO-ROBINSONS", "DAVAO-SHELL", 
  "DAVAO-SILVER SWAN", "DAVAO-URC", "DAVAO-WYETH", "DIPOLOG", "DIPOLOG-MONDE NISSIN", 
  "DUMAGUETE", "DUMAGUETE-NA", "ELISCO-EPI TRANSPORT", "ELISCO-SHELL", "FLEX-CALAMBA", 
  "FLEX-TAGUIG", "FORTUNE-PMFTC1", "FORTUNE-PMFTC2", "GENSAN", "GENSAN-GMC", "HOME OFFICE", 
  "HOME OFFICE-FMM", "ILIGAN", "ILOILO", "ILOILO-COLPAL", "ILOILO-JAPAN TOBACCO INT'L", 
  "ILOILO-JS UNITRADE", "ILOILO-JS UNITRADE RETAIL", "ILOILO-NA", "ILOILO-NEXTRADE", 
  "ILOILO-PMFTC", "ILOILO-RFM", "ILOILO-SHELL", "ILOILO-SM", "IMUS-ALFAMART", 
  "IMUS-COLDCHAIN", "IMUS-COLDCHAIN RETAIL", "IMUS-FOOD PANDA", "IMUS-SM", "JOLO", 
  "KALIBO", "KALIBO-NPI", "KORONADAL", "LA UNION-CDI", "LAGUNA-GMC", "LAGUNA-MONDE NISSIN", 
  "LAGUNA-PRIFOOD", "LAGUNA-RED RIBBON", "LAPULAPU-PMFTC OVERFLOW", "LAS PIÑAS-BOIE", 
  "LAWA-OVERFLOW", "LIBIS OVERFLOW", "LIBIS-COLPAL", "LIBIS-PMFTC", "LIBIS-UNILEVER", 
  "MAKATI-ALFAMART", "MAKATI-CDI", "MAKATI-JOLLIBEE", "MAKATI-P&G", "MAKATI-PERSONAL COLLECTION", 
  "MAKATI-PG", "MANDAUE", "MANDAUE-NA", "MANDAUE-PMFTC OVERFLOW", "MAYON", "MINDANAO", 
  "MUNTINLUPA", "MUNTINLUPA-PMFTC", "NAGA", "NAGA-PERSONAL COLLECTION", "NAGA-PMFTC", 
  "NAGA-ROBINSONS", "NORTH COTABATO", "NORTH COTABATO-RETAIL", "ODIONGAN", "OLONGAPO", 
  "OLONGAPO-NPI", "OTTAWA", "ORIENTAL MINDORO", "ORIENTAL MINDORO-NA", "ORIENTAL MINDORO-NPI", 
  "PANGASINAN", "PASAY", "PASAY-PMFTC", "PASIG", "PASIG-NA", "PASIG-NPI", "PASIG-NPI RETAIL", 
  "PANGASINAN-NA", "PANGASINAN-PERSONAL COLLECTION", "PANGASINAN-URC", "PANGASINAN-PERSONAL COLLECTION", 
  "PAMPANGA", "PAMPANGA-CDI", "PAMPANGA-CDI-RETAIL", "PAMPANGA-NPI", "PAMPANGA-PERSONAL COLLECTION", 
  "PANGALAT", "ROXAS", "SANTIAGO", "SANTA ROSA", "SANTA ROSA-RETAIL", "TACLOBAN", "TAGUIG", 
  "TALISAY", "TALISAY-NA", "TALISAY-PMFTC", "TAYTAY-NA", "TAYTAY-PMFTC", "TOLEDO", "ZAMBOANGA"
];


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


  async function registerUser(username, password, email, userType, sbu, branch) {
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email, userType, sbu, branch }),
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Registration failed', error);
        return false;
    }
}

document.getElementById('registerLink').addEventListener('click', function () {
    Swal.fire({
        title: 'Register',
        html: `
            <div>
                <label for="newUsername" class="form-label">Username</label>
                <input type="text" id="newUsername" class="form-control mb-3" placeholder="Enter a username" required>
            </div>
            <div>
                <label for="newPassword" class="form-label">Password</label>
                <input type="password" id="newPassword" class="form-control" placeholder="Enter a password" required>
            </div>
            <div>
                <label for="confirmPassword" class="form-label mt-3">Confirm Password</label>
                <input type="password" id="confirmPassword" class="form-control" placeholder="Confirm your password" required>
            </div>
            <div>
                <label for="usertype" class="form-label">User Type</label>
                <select id="usertype" class="form-control" required>
                    <option value="Non-FAST Employee">Non-FAST Employee</option>
                    <option value="FAST Employee">FAST Employee</option>
                </select>
            </div>
            <div id="SBUContainer" style="display: none;">
                <label for="SBU" class="form-label mt-3">SBU</label>
                <select id="SBU" class="form-control">
                    <option value="FSC">FSC</option>
                    <option value="FLC">FLC</option>
                </select>
                <label for="branch" class="form-label mt-3">Branch</label>
                <select id="branchSelect" class="form-control">
                    <option value="">Select Branch</option>
                </select>
            </div>
            <div class="mt-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" class="form-control" placeholder="Enter your email" required>
            </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Register',
        cancelButtonText: 'Cancel',
        customClass: {
            confirmButton: 'btn btn-primary me-3',
            cancelButton: 'btn btn-secondary',
            buttons: 'custom-buttons',
        },
        buttonsStyling: false,
    }).then(async (result) => {
        if (result.isConfirmed) {
            const newUsername = document.getElementById('newUsername').value.trim();
            const newPassword = document.getElementById('newPassword').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            const email = document.getElementById('email').value.trim();
            const userType = document.getElementById('usertype').value;
            const sbu = userType === 'FAST Employee' ? document.getElementById('SBU').value : '';
            const branch = userType === 'FAST Employee' ? document.getElementById('branchSelect').value : '';

            if (!newUsername || !newPassword || !confirmPassword || !email) {
                Swal.fire('Error!', 'Please fill in all required fields.', 'error');
                return;
            }

            if (newPassword !== confirmPassword) {
                Swal.fire('Error!', 'Passwords do not match.', 'error');
                return;
            }

            if (userType === 'FAST Employee' && (!sbu || !branch)) {
                Swal.fire('Error!', 'SBU and Branch are required for FAST Employees.', 'error');
                return;
            }

            try {
                const success = await registerUser(newUsername, newPassword, email, userType, sbu, branch);
                if (success) {
                    Swal.fire('Success!', 'Your account has been created. You can now log in.', 'success');
                } else {
                    Swal.fire('Failed!', 'An error occurred during registration. Please try again later.', 'error');
                }
            } catch (error) {
                Swal.fire('Error!', 'An error occurred during registration. Please try again later.', 'error');
            }
        }
    });

    // Populate branches dynamically
    const select = document.getElementById('branchSelect');
    branches.forEach((branch) => {
        const option = document.createElement('option');
        option.value = branch;
        option.textContent = branch;
        select.appendChild(option);
    });

    // Toggle SBU visibility based on user type selection
    const userTypeSelect = document.getElementById('usertype');
    const sbuContainer = document.getElementById('SBUContainer');
    userTypeSelect.addEventListener('change', function () {
        if (userTypeSelect.value === 'FAST Employee') {
            sbuContainer.style.display = 'block';
        } else {
            sbuContainer.style.display = 'none';
        }
    });
});




  


